import React from "react";
import { isMobileOnly } from "react-device-detect";
import Auth from "sc-user-service-client/dist/auth";
import { v4 as uuidv4 } from "uuid";

import { gameVipIds, LanguageLocaleMapper } from "../../../common/constants";
import * as LocalStorageManager from "../../../common/local-storage";
import { CommonResourceKeys, GameResourceKeys } from "../../../common/resources";
import { AuthContext } from "../../../contexts/auth";
import { GameActionsContextProvider } from "../../../contexts/game-actions-context";
import { GameContextProvider } from "../../../contexts/game-context/game-context";
import { GetLocalizedErrorMessage } from "../../../helpers/notice-helper";
import { getBalance } from "../../../services/auth-service";
import { SocketState } from "../../../types";
import GameContainer from "../../shared/game-container";
import ScoreboardRoundHistory from "../../shared/round-history/scoreboard";
import AcceptBet from "../animations/accept-bet";
import WinningBet from "../animations/winning-bet";
import BalancedBettingPool from "../balanced-betting-pool";
import BaseDialog from "../base-dialog";
import { ModalType } from "../base-dialog/type";
import { BaseResult } from "../base-result";
import BetContainer from "../bet-container";
import DisabledModal from "../disabled-modal";
import { ConnectFailedMessage, ErrorMessage } from "../error-message";
import GameHeader from "../game-header/game-header";
import GameLoading from "../game-loading";
import { Notice } from "../notice";
import PlaceBetModal from "../place-bet-modal/place-bet-modal";
import Rebet from "../rebet";
import ResultDetail from "../result-detail";
import Styles from "./game-base.module.scss";
import MessageTransmitter from "./message-transmitter";
import { MessageTransmitterType } from "./message-transmitter/type";
import { GameBaseProps, GameBaseState, GameState, PopupType, RebetStorageModel, ViewMode, WinStreakCollectorModel } from "./type";

const { rebet: reBetStorageKey } = LocalStorageManager.localStorageKeys;
let isUpdateUserStakeLevel = false;
abstract class GameBase<P extends GameBaseProps, S extends GameBaseState<any, any>> extends React.PureComponent<P, S> {
    private readonly animationTime = 3000;
    private readonly gameBaseContainerRef = React.createRef<HTMLDivElement>();
    private betWin: number;
    private isUMInFirstLoad = false;
    private showResultInfoTimeout: NodeJS.Timeout;
    private showWinningAnimationTimeout: NodeJS.Timeout;
    private isProcessingBet = false;
    private winStreakCollector: WinStreakCollectorModel;
    private retryInterval: NodeJS.Timeout;

    protected interval: NodeJS.Timeout;
    protected timeCounter: number;
    protected reBetStorageKey: string;
    protected messageTransmitter: MessageTransmitterType;
    protected authService: Auth;

    private readonly defaultGameConfig = { odds: {}, minbet: 0, maxbet: 0, choices_maxbet: {}, enableFreeBet: false };
    protected readonly defaultState = {
        signedIn: false,
        gameState: GameState.None,
        remainingTime: 0,
        gameConfigs: { ...this.defaultGameConfig },
        roundHistory: [],
        roundId: 0,
        ownBets: {},
        totalBets: {},
        displayPopup: null,
        betPercentage: {},
        viewMode: this.props.viewMode,
        showResultInfo: false,
        acceptedBetQueue: {},
        showWinningAnimation: false,
        playResultAnimation: false,
        isShowBlink: false,
        notice: null,
        removeBetChoiceFocus: null,
        betOptionElement: null,
        betChoiceElement: null,
        activeScoreboardTab: 0,
    };

    constructor(props: P) {
        super(props);

        this.messageTransmitter = MessageTransmitter();
        this.initWinStreakCollector();

        this.closePopup = this.closePopup.bind(this);
        this.openPopup = this.openPopup.bind(this);
        this.placeBet = this.placeBet.bind(this);
        this.openPlaceBetModal = this.openPlaceBetModal.bind(this);
        this.updateViewMode = this.updateViewMode.bind(this);
        this.playAcceptedBetAnimation = this.playAcceptedBetAnimation.bind(this);
        this.closeNotice = this.closeNotice.bind(this);
        this.renderSettlementInfo = this.renderSettlementInfo.bind(this);
        this.updateUserBalance = this.updateUserBalance.bind(this);
        this.setActiveScoreboardTab = this.setActiveScoreboardTab.bind(this);
    }

    componentDidMount() {
        this.registerMessageHandler();
        document.addEventListener("visibilitychange", this.onVisibilityChange);
        this.onStart();
    }

    requestSignIn() {
        const { gameName } = this.props;
        const { session } = this.context;
        this.props.socketGateway.off(this.props.gameName).on(this.props.gameName, this.messageTransmitter.broadcast.bind(this));
        this.props.socketGateway.emit("signIn", { gameName, session });
    }

    componentDidUpdate(prevProps) {
        if (this.props.socketGatewayState !== prevProps.socketGatewayState) {
            switch (this.props.socketGatewayState) {
                case SocketState.Connected:
                    this.onStart();
                    break;
                case SocketState.Error:
                    this.setState({ gameState: GameState.ConnectFailed });
                    break;
                default:
                    this.setState({ signedIn: false });
                    break;
            }
        }
    }

    componentWillUnmount() {
        this.onDestroy();
        this.messageTransmitter.clearAllListener();
        document.removeEventListener("visibilitychange", this.onVisibilityChange);
    }

    onDestroy() {
        this.props.socketGateway && this.props.socketGateway.emit("outGame", this.props.gameName);
        this.interval && clearInterval(this.interval);
        this.showResultInfoTimeout && clearTimeout(this.showResultInfoTimeout);
        this.showWinningAnimationTimeout && clearTimeout(this.showWinningAnimationTimeout);
        this.clearRetryInterval();
    }

    onStart() {
        this.isProcessingBet = false;
        this.initWinStreakCollector();
        this.props.socketGateway?.connected && this.requestSignIn();
    }

    onMessageUserStakeLevel({ userStakeLevel }) {
        if (!isUpdateUserStakeLevel) {
            this.props.updateUserStakeLevel(userStakeLevel);
            isUpdateUserStakeLevel = true;
        }
    }

    onVisibilityChange = () => {
        const visibleState = document.visibilityState;
        visibleState === "hidden" ? this.onDestroy() : this.onStart();
    };

    onConnectFailed() {
        this.onDestroy();
        this.setState({ gameState: GameState.ConnectFailed, signedIn: false });
    }

    registerMessageHandler = () => {
        this.messageTransmitter.register("signedIn", this.handleSignedIn.bind(this));
        this.messageTransmitter.register("um", this.handleUM.bind(this));
        this.messageTransmitter.register("remainingTime", this.handleRemainingTime.bind(this));
        this.messageTransmitter.register("gameConfigs", this.handleGameConfigs.bind(this));
        this.messageTransmitter.register("roundHistory", this.handleRoundHistory.bind(this));
        this.messageTransmitter.register("finish", this.handleFinish.bind(this));
        this.messageTransmitter.register("status", this.handleStatus.bind(this));
        this.messageTransmitter.register("user", this.handleUserData.bind(this));
        this.messageTransmitter.register("totalBets", this.handleTotalBet.bind(this));
        this.messageTransmitter.register("ownBets", this.handleOwnBets.bind(this));
        this.messageTransmitter.register("betPercentage", this.handlePercentageBets.bind(this));
        this.messageTransmitter.register("endBet", this.handleEndBet.bind(this));
        this.messageTransmitter.register("apiError", this.handleApiError.bind(this));
        this.messageTransmitter.register("userStakeLevel", this.handleUserStakeLevel.bind(this));
        this.messageTransmitter.register("errorCode", this.handleError.bind(this));
    };

    handleError = ({ errorCode }) => {
        if (errorCode === "SB0010") {
            this.setState({ gameState: GameState.ConnectFailed });
        }
    };

    handleSignedIn = ({ signedIn }) => {
        console.log("signedIn" + this.props.gameName);
        if (signedIn) {
            this.setState({ signedIn: true });
            this.props.socketGateway.emit("inGame", this.props.gameName);
        }
    };

    handleUserStakeLevel({ userStakeLevel }) {
        this.props.updateUserStakeLevel(userStakeLevel);
        gameVipIds.includes(this.props.id) &&
            this.setState({ notice: { message: this.props.t(`common:${CommonResourceKeys.USER_STAKE_LEVEL_UPDATE}`), duration: 2 } });
    }

    handleStatus = ({ status }) => {
        const { win, bet } = status;
        if (win) {
            this.betWin = bet;
            this.updateUserBalance();
        }
    };

    get winningAnimationWaitingTimeInSecond() {
        return this.props.durations.showResult * 1000;
    }

    handleApiError = ({ apiError }) => {
        const isPlaceBet = apiError.isPlaceBetFailed ? apiError.isPlaceBetFailed : false;
        const message = GetLocalizedErrorMessage(apiError.errorCode, isPlaceBet);
        const gameName = this.props.t(`${this.props.gameName.toLowerCase()}:${GameResourceKeys.GAME_NAME}`);

        const { displayPopup } = this.state;
        displayPopup !== PopupType.Rebet &&
            this.setState({
                notice: {
                    gameName: gameName,
                    roundId: apiError?.gameRoundId,
                    message: message,
                    duration: 3,
                    minBet: apiError?.minBet,
                    maxBet: apiError?.maxBet,
                    errorCode: apiError.errorCode,
                },
            });
    };

    handleBetFailed = ({ notice, kickedOut }) => {
        const { displayPopup } = this.state;

        displayPopup !== PopupType.Rebet && this.setState({ notice: null });
        const gameName = this.props.t(`${this.props.gameName.toLowerCase()}:${GameResourceKeys.GAME_NAME}`);
        if (kickedOut?.isDisabledAccount) {
            this.setState({
                notice: {
                    gameName: gameName,
                    message: GetLocalizedErrorMessage(kickedOut.errorCode),
                    duration: 2,
                    errorCode: kickedOut.errorCode,
                    roundId: kickedOut?.gameRoundId,
                },
            });

            const { router } = this.props;
            setTimeout(() => {
                router.push("/timeout");
            }, 10000);
        } else {
            const isPlaceBet = notice.isPlaceBetFailed ? notice.isPlaceBetFailed : false;
            displayPopup !== PopupType.Rebet &&
                this.setState({
                    notice: {
                        gameName: gameName,
                        message: GetLocalizedErrorMessage(notice.errorCode, isPlaceBet),
                        duration: 2,
                        minBet: notice?.minBet,
                        maxBet: notice?.maxBet,
                        errorCode: notice.errorCode,
                        roundId: notice?.gameRoundId,
                    },
                });
        }
    };

    handleEndBet = ({ endBet, betChoice, notice, kickedOut, apiError }) => {
        const { playPlaceBetSound } = this.props;
        const { displayPopup, ownBets } = this.state;
        this.isProcessingBet = false;
        this.clearRetryInterval();
        this.setState({ notice: null });

        if (endBet === -1) {
            !apiError && this.handleBetFailed({ notice, kickedOut });
        } else {
            displayPopup !== PopupType.Rebet && this.playAcceptedBetAnimation(endBet);
            playPlaceBetSound();
            ownBets[betChoice] = ownBets[betChoice] ? ownBets[betChoice] + endBet : endBet;
            this.updateUserBalance();
        }
    };

    playAcceptedBetAnimation(amount: number) {
        const { acceptedBetQueue } = this.state;
        const key = uuidv4();
        acceptedBetQueue[key] = amount;

        this.setState({ acceptedBetQueue: { ...acceptedBetQueue } });
        setTimeout(() => {
            this.removeAcceptedBetQueue(key);
        }, this.animationTime);
    }

    removeAcceptedBetQueue(key: number) {
        const { acceptedBetQueue } = this.state;
        delete acceptedBetQueue[key];
        this.setState({ acceptedBetQueue });
    }

    handleTotalBet = ({ totalBets }) => {
        this.setState({ totalBets });
    };

    handleOwnBets = ({ ownBets, gameConfigs }) => {
        gameConfigs && this.setState({ ownBets });
    };

    handlePercentageBets = ({ betPercentage }) => {
        this.setState({ betPercentage });
    };

    handleUserData({ user }) {
        this.context.setBalance(user.red);
    }

    handleUM({ um, um_message, remainingTime }) {
        const { durations, i18n } = this.props;
        if (um && remainingTime && remainingTime + 1 === durations.wholeRound) {
            this.isUMInFirstLoad = true;
        } else {
            this.isUMInFirstLoad = false;
        }

        if (
            um &&
            (this.timeCounter <= durations.placingBets + durations.beforeStartRound + 1 || remainingTime + 1 === durations.wholeRound)
        ) {
            this.interval && clearInterval(this.interval);
            this.showResultInfoTimeout && clearTimeout(this.showResultInfoTimeout);
            this.showWinningAnimationTimeout && clearTimeout(this.showWinningAnimationTimeout);
            this.setState({
                gameState: GameState.Disabled,
                disabledMessage: um_message[LanguageLocaleMapper[i18n.language]],
                showResultInfo: false,
            });
        }
    }

    handleRemainingTime({ remainingTime }) {
        const { gameState } = this.state;

        if (gameState === GameState.None || !this.isUMInFirstLoad) {
            this.runGame(remainingTime);
        }
    }

    runGame(remainingTime: number) {
        this.timeCounter = remainingTime;

        this.interval && clearInterval(this.interval);
        this.interval = setInterval(() => {
            if (this.timeCounter > 0) {
                this.timeCounter = this.timeCounter - 1;
            }
            this.handleGamePlay(this.timeCounter);
        }, 1000);

        this.handleGamePlay(remainingTime);
    }

    handleGamePlay(remainingTime: number) {
        const newGameState = this.determineGameState(remainingTime);

        if (this.state.gameState !== newGameState) {
            const newState = {
                gameState: newGameState,
                ...this.getStateByNextGameState(newGameState),
            };

            this.setState(newState);
        }
    }

    getStateByNextGameState(nextGameState: GameState) {
        const { roundId, displayPopup, notice } = this.state;
        const { durations } = this.props;
        const timeCounter = this.getTimeCounter(this.timeCounter, nextGameState);

        if (nextGameState === GameState.InRound) {
            this.betWin = 0;
        }

        const newStateDetector = [
            {
                condition: [GameState.BeforeStartRound, GameState.InRound].includes(nextGameState),
                state: {
                    ownBets: {},
                    totalBets: {},
                    showWinningAnimation: false,
                    isShowBlink: false,
                    playResultAnimation: false,
                    showResultInfo: false,
                    betPercentage: {},
                },
            },
            {
                condition: durations.beforeStartRound ? nextGameState === GameState.BeforeStartRound : nextGameState === GameState.InRound,
                state: {
                    roundId: roundId + 1,
                },
            },
            {
                condition: nextGameState === GameState.LockingBet,
                state: {
                    isShowBlink: true,
                    displayPopup: [PopupType.Rebet, PopupType.PlaceBet].includes(displayPopup) ? null : displayPopup,
                    notice: [PopupType.Rebet, PopupType.PlaceBet].includes(displayPopup) ? null : notice,
                },
            },
        ];

        return newStateDetector.reduce(
            (newState, stateDetector) => {
                if (stateDetector.condition) {
                    newState = Object.assign(newState, stateDetector.state);
                }

                return newState;
            },
            { remainingTime: timeCounter }
        );
    }

    async updateUserBalance() {
        const balanceResponse = await getBalance(this.context.session);

        if (balanceResponse.isSuccessful) {
            this.context.setBalance(balanceResponse.balance);
        } else {
            this.props.setApiErrorMessage(balanceResponse.errorCode);
        }
    }

    handleGameConfigs({ gameConfigs }) {
        console.log("handleGameConfigs" + this.props.gameName);
        this.setState({ gameConfigs });
    }

    determineGameState(remainingTime: number) {
        const { durations } = this.props;

        if (durations.balancingBet && remainingTime > durations.wholeRound - durations.balancingBet) {
            return GameState.BalancingBet;
        }

        if (remainingTime >= durations.wholeRound - durations.showResult - (durations.balancingBet ?? 0)) {
            return GameState.DisplayResult;
        }

        if (durations.beforeStartRound && remainingTime > durations.placingBets) {
            return GameState.BeforeStartRound;
        }

        if (remainingTime <= durations.placingBets && remainingTime > durations.lockingBet) {
            return GameState.InRound;
        }

        if (remainingTime <= durations.lockingBet && remainingTime >= 0) {
            return GameState.LockingBet;
        }

        return GameState.None;
    }

    getTimeCounter(remainingTime: number, gameState: GameState) {
        const { durations } = this.props;

        switch (gameState) {
            case GameState.InRound:
            case GameState.LockingBet:
                return remainingTime;
            case GameState.BeforeStartRound:
                return durations.beforeStartRound;
            default:
                return 0;
        }
    }

    handleRoundHistory({ roundHistory, roundId }) {
        const { gameState } = this.state;

        this.setState({
            roundHistory: roundHistory,
            roundId: [GameState.DisplayResult, GameState.BalancingBet].includes(gameState) || this.isUMInFirstLoad ? roundId - 1 : roundId,
            result: roundHistory[0]?.result,
            settlementResult: roundHistory[0]?.settlementResult,
        });

        this.setWinStreakByRoundHistory(roundHistory);
    }

    getFinishAnimationDuration() {
        return this.props.durations.resultAnimation * 1000;
    }

    handleFinish({ finish }) {
        const { roundHistory } = this.state;
        const { durations } = this.props;
        const roundHistoryClone = [...roundHistory];

        this.isProcessingBet = false;
        this.clearRetryInterval();
        this.storeOwnBet(finish.roundId);
        roundHistoryClone.unshift(finish);
        roundHistoryClone.length > 100 && roundHistoryClone.pop();

        this.setState({
            playResultAnimation: true,
            result: finish.result,
            settlementResult: finish.settlementResult,
        });

        const animationDuration = this.getFinishAnimationDuration();

        this.showResultInfoTimeout = setTimeout(() => {
            this.setState({ showResultInfo: true, isShowBlink: false, roundHistory: roundHistoryClone, playResultAnimation: false });
            this.notifyWinStreakByLatestSettlementResult(finish.settlementResult);
        }, animationDuration);

        this.showWinningAnimationTimeout = setTimeout(() => {
            this.setState({
                showWinningAnimation: true,
            });
        }, this.winningAnimationWaitingTimeInSecond);

        this.runGame(durations.wholeRound);
    }

    storeOwnBet(roundId: number) {
        const { ownBets } = this.state;
        const gameId = this.props.id;
        const rebetStorage = LocalStorageManager.getLocalStorageItem<RebetStorageModel>(reBetStorageKey) || {};

        rebetStorage[gameId] = {
            roundId,
            betInfo: Object.keys(ownBets).length > 0 ? ownBets : undefined,
        };

        LocalStorageManager.storeLocalStorageItem(reBetStorageKey, rebetStorage);
    }

    openPlaceBetModal(betChoice: string, removeBetChoiceFocus: Function, betOptionElement: HTMLElement, betChoiceElement: HTMLElement) {
        this.setState({
            displayPopup: PopupType.PlaceBet,
            selectedBetChoice: betChoice,
            removeBetChoiceFocus,
            betOptionElement,
            betChoiceElement,
        });
    }

    placeBet(betChoice: string, amount: number) {
        const { displayPopup } = this.state;

        if (this.isProcessingBet && displayPopup !== PopupType.Rebet) {
            this.setState({ notice: { message: this.props.t("messages:betProcessing"), duration: 2 } });
        } else {
            if (amount > 0) {
                this.isProcessingBet = true;
                this.setRetryInterval();
                const { gameName } = this.props;
                const betData = { betChoice, amount };
                this.props.socketGateway.emit("bet", { gameName, betData });
            }
        }
    }

    setRetryInterval() {
        this.clearRetryInterval();

        this.retryInterval = setInterval(() => {
            this.props.socketGateway.emit("retry");
        }, 3 * 1000);
    }

    clearRetryInterval() {
        this.retryInterval && clearInterval(this.retryInterval);
    }

    openPopup(popupType: PopupType) {
        this.setState({ displayPopup: popupType });
    }

    updateViewMode(mode: ViewMode) {
        this.setState({ viewMode: mode });
    }

    renderErrorMessage() {
        return (
            <BaseDialog type={ModalType.Center} isOpen={this.state.displayPopup === PopupType.Error} onCloseModal={this.closePopup}>
                <ErrorMessage message={this.state.errorMessage} closeModal={this.closePopup}></ErrorMessage>
            </BaseDialog>
        );
    }

    renderReBet() {
        const betContainerRef = this.gameBaseContainerRef;
        const domRect = betContainerRef.current.getBoundingClientRect();
        const betContainerPosition = domRect.y;

        return (
            <BaseDialog
                betContainerPosition={isMobileOnly ? betContainerPosition : null}
                type={ModalType.Rebet}
                isOpen={this.state.displayPopup === PopupType.Rebet}
                onCloseModal={this.closePopup}
            >
                <Rebet getOddsByChoice={this.getOddsByChoice.bind(this)} gameId={this.props.id} onCloseModal={this.closePopup} />
            </BaseDialog>
        );
    }

    renderPlaceBet() {
        const { displayPopup, selectedBetChoice, roundId, removeBetChoiceFocus, betOptionElement, betChoiceElement } = this.state;
        const { gameName } = this.props;

        return (
            <PlaceBetModal
                isOpen={displayPopup === PopupType.PlaceBet}
                onCloseModal={this.closePopup}
                onPlaceBet={this.placeBet}
                gameBaseContainerRef={this.gameBaseContainerRef}
                betOptionElement={betOptionElement}
                betChoiceElement={betChoiceElement}
                removeBetChoiceFocus={removeBetChoiceFocus}
                betChoiceInfo={{
                    betChoice: selectedBetChoice,
                    gameName: gameName,
                    roundId: roundId,
                    odd: this.getOddsByChoice(selectedBetChoice),
                }}
            />
        );
    }

    setActiveScoreboardTab = (activeScoreboardTab: number) => {
        this.setState({ activeScoreboardTab });
    };

    abstract renderBetOptions(): React.ReactElement;

    abstract renderRoundHistory(): React.ReactElement;

    abstract renderStatistic(): React.ReactElement;

    abstract renderBoard(): React.ReactElement;

    abstract renderResult(): React.ReactElement;

    abstract renderResultCollapse(): React.ReactElement;

    abstract getMainOptions(): string[];

    abstract renderSettlementInfo(): JSX.Element;

    getGameTranslate(key: string) {
        const { t, gameName } = this.props;

        return t(`${gameName.toLocaleLowerCase()}:${key}`);
    }

    setWinStreakByRoundHistory(roundHistory) {
        const history = roundHistory.sort((a, b) => a.roundId < b.roundId);
        const mainOptions = this.getMainOptions();
        this.initWinStreakCollector();

        for (const round of history) {
            mainOptions.forEach((option) => {
                if (round.settlementResult[option] && !this.winStreakCollector[option].isStopStreak) {
                    this.winStreakCollector[option].streak += 1;
                } else {
                    this.winStreakCollector[option].isStopStreak = true;
                }
            });

            if (!mainOptions.some((option) => this.winStreakCollector[option].isStopStreak === false)) {
                break;
            }
        }
    }

    initWinStreakCollector() {
        const mainOptions = this.getMainOptions();

        this.winStreakCollector = mainOptions.reduce((result, option) => {
            result[option] = {
                streak: 0,
                isStopStreak: false,
            };

            return result;
        }, {});
    }

    getWinningStreakByOptions = (options: string[]) => {
        return Math.max(...options.map((option) => this.winStreakCollector[option]?.streak ?? 0));
    };

    notifyWinStreakByLatestSettlementResult(settlementResult) {
        const { notifyWinStreak, gameName } = this.props;
        const mainOptions = this.getMainOptions();

        mainOptions.forEach((option) => {
            const winStreak = this.winStreakCollector[option];

            if (settlementResult[option]) {
                winStreak.streak += 1;

                if (winStreak.streak > 3) {
                    notifyWinStreak({
                        key: uuidv4(),
                        gameName: gameName,
                        choice: option,
                        streak: winStreak.streak,
                    });
                }
            } else {
                winStreak.streak = 0;
            }
        });
    }

    getOddsByChoice(choice: string) {
        const { gameConfigs } = this.state;
        const odds = gameConfigs.odds;

        return odds[choice];
    }

    renderStartRoundAnimation() {
        return null;
    }

    renderPopup(popupType: PopupType) {
        switch (popupType) {
            case PopupType.Rebet:
                return this.renderReBet();
            case PopupType.Error:
                return this.renderErrorMessage();
            case PopupType.PlaceBet:
                return this.renderPlaceBet();
            default:
                return null;
        }
    }

    closePopup() {
        this.setState({ displayPopup: null });
    }

    renderNotice() {
        const { gameName, message, roundId, duration, minBet, maxBet, errorCode } = this.state.notice;
        return (
            <Notice
                gameName={gameName}
                roundId={roundId}
                message={message}
                duration={duration}
                minBet={minBet}
                maxBet={maxBet}
                errorCode={errorCode}
                onClose={this.closeNotice}
            />
        );
    }

    closeNotice() {
        this.setState({ notice: null });
    }

    get isShowStartRoundAnimation() {
        return false;
    }

    getRoundHistoryTabStyles() {
        return "";
    }

    renderGame() {
        const { durations } = this.props;

        const {
            remainingTime,
            roundId,
            gameState,
            totalBets,
            ownBets,
            gameConfigs,
            viewMode,
            playResultAnimation,
            isShowBlink,
            displayPopup,
            activeScoreboardTab,
        } = this.state;

        const gameContext = {
            totalBets,
            ownBets,
            gameSetting: this.props,
            roundId,
            gameConfigs,
            gameState,
            remainingTime,
            viewMode,
            playResultAnimation,
            isShowBlink,
        };

        const gameActionsContext = {
            placeBet: this.placeBet,
            openPopup: this.openPopup,
            closePopup: this.closePopup,
            registerMessageHandler: this.messageTransmitter.register,
            unsubscribeMessageHandler: this.messageTransmitter.unsubscribe,
            openPlaceBetModal: this.openPlaceBetModal,
            updateViewMode: this.updateViewMode,
            playAcceptedBetAnimation: this.playAcceptedBetAnimation,
            finishProcessingBet: () => {
                this.isProcessingBet = false;
                this.clearRetryInterval();
            },
            renderResultCollapse: this.renderResultCollapse.bind(this),
            setActiveScoreboardTab: this.setActiveScoreboardTab,
        };

        const animationDuration = this.getFinishAnimationDuration() / 1000;

        return (
            <GameContextProvider value={gameContext}>
                <GameActionsContextProvider value={gameActionsContext}>
                    <GameHeader />
                    {viewMode !== ViewMode.collapse && (
                        <>
                            <BetContainer gameState={gameState}>
                                <div ref={this.gameBaseContainerRef} className={`${Styles["bet-options"]} ${Styles[this.props.gameName]}`}>
                                    {this.renderBetOptions()}
                                </div>

                                {this.isShowStartRoundAnimation && this.renderStartRoundAnimation()}
                                {this.state.gameState === GameState.DisplayResult && (
                                    <BaseResult showResultTimeInSecond={durations.showResult}>{this.renderResult()}</BaseResult>
                                )}
                                {this.state.showResultInfo && this.state.gameState === GameState.DisplayResult && (
                                    <ResultDetail
                                        renderSettlementInfo={this.renderSettlementInfo}
                                        timeToShowInSecond={durations.showResult - animationDuration}
                                    />
                                )}
                                {this.state.gameState === GameState.BalancingBet && <BalancedBettingPool />}
                                {this.state.notice && this.renderNotice()}
                                {(this.state.showResultInfo || this.state.showWinningAnimation) && this.betWin > 0 && (
                                    <WinningBet amount={this.betWin} />
                                )}
                                {Object.keys(this.state.acceptedBetQueue).map((key) => (
                                    <AcceptBet key={key} amount={this.state.acceptedBetQueue[key]} />
                                ))}
                            </BetContainer>
                            <div className={`${Styles["mini-round-history"]} ${this.getRoundHistoryTabStyles()}`}>
                                {this.state.roundHistory.length > 0 ? this.renderRoundHistory() : <></>}
                            </div>
                            {viewMode === ViewMode.full && (
                                <>
                                    <div className={`${Styles["statistic"]}`}>
                                        {this.state.roundHistory.length > 0 ? this.renderStatistic() : <></>}
                                    </div>
                                    <ScoreboardRoundHistory activeScoreboardTab={activeScoreboardTab}>
                                        {this.state.roundHistory.length > 0 ? this.renderBoard() : <></>}
                                    </ScoreboardRoundHistory>
                                </>
                            )}
                        </>
                    )}
                    {this.renderPopup(displayPopup)}
                </GameActionsContextProvider>
            </GameContextProvider>
        );
    }

    retryConnect = () => {
        this.props.socketGateway.connected ? this.onStart() : this.props.retryConnectSocket();
    };

    render() {
        const { signedIn, gameState, disabledMessage, viewMode } = this.state;
        return (
            <GameContainer>
                {signedIn ? this.renderGame() : <GameLoading />}
                {gameState === GameState.Disabled && <DisabledModal disabledMessage={disabledMessage} viewMode={viewMode} />}
                {gameState === GameState.ConnectFailed && (
                    <ConnectFailedMessage
                        gameName={this.props.t(`${this.props.gameName.toLowerCase()}:${GameResourceKeys.GAME_NAME}`)}
                        retryConnect={this.retryConnect}
                    />
                )}
            </GameContainer>
        );
    }
}

GameBase.contextType = AuthContext;

export default GameBase;
