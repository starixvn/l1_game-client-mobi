import React from "react";
import { isMobileOnly } from "react-device-detect";
import { Spinner } from "reactstrap";
import Auth from "sc-user-service-client/dist/auth";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

import appSettings from "../../../common/app-settings";
import { gameVipIds } from "../../../common/constants";
import * as LocalStorageManager from "../../../common/local-storage";
import { CommonResourceKeys, GameResourceKeys } from "../../../common/resources";
import { AuthContext } from "../../../contexts/auth";
import { GameActionsContextProvider } from "../../../contexts/game-actions-context";
import { GameContextProvider } from "../../../contexts/game-context/game-context";
import { convertAmountToChips } from "../../../helpers/chip-helper";
import { GetLocalizedErrorMessage } from "../../../helpers/notice-helper";
import { UserClientCommunication } from "../../../services";
import GameContainer from "../../shared/game-container";
import ScoreboardRoundHistory from "../../shared/round-history/scoreboard";
import AcceptBet from "../animations/accept-bet";
import WinningBet from "../animations/winning-bet";
import BalancedBettingPool from "../balanced-betting-pool";
import BaseDialog from "../base-dialog";
import { ModalType } from "../base-dialog/type";
import BetContainer from "../bet-container";
import DisabledModal from "../disabled-modal";
import { ConnectFailedMessage, ErrorMessage } from "../error-message";
import GameHeader from "../game-header/game-header";
import GameLoading from "../game-loading";
import { Notice } from "../notice";
import PlaceBetModal from "../place-bet-modal/place-bet-modal";
import Rebet from "../rebet";
import WaitingTimeAnimation from "../waiting-time-animation";
import Styles from "./game-base.module.scss";
import MessageTransmitter from "./message-transmitter";
import { MessageTransmitterType } from "./message-transmitter/type";

import {
    GameBaseProps,
    GameBaseState,
    GameState,
    PopupType,
    RebetStorageModel,
    UserBetChipStorageModal,
    WinStreakCollectorModel,
    ModeView,
} from "./type";

const { userBetChips: userBetChipsKey, rebet: reBetStorageKey } = LocalStorageManager.localStorageKeys;
abstract class GameBase<P extends GameBaseProps, S extends GameBaseState<any, any>> extends React.Component<P, S> {
    private readonly animationTime = 3000;
    private readonly winningAnimationTime = 4000;
    private betWin: number;
    private isUMInFirstLoad = false;
    private showWaitingTimeout: NodeJS.Timeout;
    private readonly gameContainerRef = React.createRef<HTMLDivElement>();
    private isProcessingBet = false;
    private winStreakCollector: WinStreakCollectorModel;
    protected socket: SocketIOClient.Socket;
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
        userStakeLevel: null,
        displayPopup: null,
        betPercentage: {},
        modeView: ModeView.full,
        showWaitingTime: false,
        acceptedBetQueue: {},
        showWinningBet: false,
        playResultAnimation: false,
        displayChips: {},
        isShowBlink: false,
        notice: null,
    };

    constructor(props: P) {
        super(props);

        this.messageTransmitter = MessageTransmitter();
        this.initWinStreakCollector();
        this.authService = UserClientCommunication.getUserClientInstance().auth;

        this.registerMessageHandler();
        this.closePopup = this.closePopup.bind(this);
        this.openPopup = this.openPopup.bind(this);
        this.placeBet = this.placeBet.bind(this);
        this.openPlaceBetModal = this.openPlaceBetModal.bind(this);
        this.updateModeView = this.updateModeView.bind(this);
        this.playAcceptedBetAnimation = this.playAcceptedBetAnimation.bind(this);
        this.closeNotice = this.closeNotice.bind(this);
    }

    componentDidMount() {
        this.onStart();

        document.addEventListener("visibilitychange", this.onVisibilityChange.bind(this), false);
    }

    componentWillUnmount() {
        this.onDestroy();

        this.messageTransmitter.clearAllListener();
        document.removeEventListener("visibilitychange", this.onVisibilityChange.bind(this));
    }

    onDestroy() {
        this.interval && clearInterval(this.interval);
        this.socket && this.socket.disconnect();
    }

    onStart() {
        const { socketInfo } = this.props;
        const { session } = this.context;
        const { proxy } = appSettings;
        const socketUri = `${proxy.ssl ? "https" : "http"}://${proxy.uri}/user/${socketInfo.namespace}`;

        this.initWinStreakCollector();
        this.socket = io(socketUri, {
            forceNew: true,
            transports: ["websocket"],
            upgrade: false,
            path: `${proxy.path}/${socketInfo.path}/socket.io`,
        });
        this.socket.on("connect", () => {
            this.socket.emit("signin", session);
        });
        this.socket.on("signedIn", () => {
            this.setState({ signedIn: true });
            this.socket.emit("inGame");
        });

        this.socket.on("message", this.setUserStakeLevel.bind(this));
        this.socket.on(this.props.gameName, this.messageTransmitter.broadcast.bind(this));

        this.socket.on("connect_error", this.onConnectFailed.bind(this));
        this.socket.on("disconnect", () => {
            this.setState({ gameState: GameState.None });
        });
    }

    onVisibilityChange() {
        const visibleState = document.visibilityState;
        visibleState === "hidden" ? this.onDestroy() : this.onStart();
    }

    onConnectFailed() {
        this.onDestroy();
        this.setState({ gameState: GameState.ConnectFailed, signedIn: false });
    }

    registerMessageHandler = () => {
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
    };

    handleStatus = ({ status }) => {
        const { durations } = this.props;
        const { win, bet } = status;
        if (win) {
            this.betWin = bet;
            setTimeout(() => {
                this.setState({ showWinningBet: true });
                this.updateUserBalance();

                setTimeout(() => {
                    this.setState({ showWinningBet: false });
                }, this.winningAnimationTime);
            }, ((durations.balancingBet ?? 0) + durations.resultAnimation) * 1000);
        }
    };

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
        const { id, playPlaceBetSound } = this.props;
        const { displayPopup, roundId, ownBets } = this.state;
        this.isProcessingBet = false;
        this.setState({ notice: null });

        if (endBet === -1) {
            !apiError && this.handleBetFailed({ notice, kickedOut });
        } else {
            const newDisplayChips = this.getDisplayChips(betChoice, endBet);

            LocalStorageManager.storeLocalStorageItem(userBetChipsKey, {
                [id]: { roundId: roundId, chips: newDisplayChips },
            });

            displayPopup !== PopupType.Rebet && this.playAcceptedBetAnimation(endBet);
            playPlaceBetSound();
            ownBets[betChoice] = ownBets[betChoice] ? ownBets[betChoice] + endBet : endBet;
            this.setState({ displayChips: newDisplayChips });
            this.updateUserBalance();
        }
    };

    playAcceptedBetAnimation(amount: number) {
        const { acceptedBetQueue } = this.state;
        const key = uuidv4();
        acceptedBetQueue[key] = amount;

        this.setState({ acceptedBetQueue });
        setTimeout(() => {
            this.removeAcceptedBetQueue(key);
        }, this.animationTime);
    }

    getDisplayChips = (betChoice: string, amount: number) => {
        const { displayChips } = this.state;
        const chips = convertAmountToChips(amount);

        displayChips[betChoice] ? displayChips[betChoice].push(...chips) : Object.assign(displayChips, { [betChoice]: [...chips] });

        return displayChips;
    };

    removeAcceptedBetQueue(key: number) {
        const { acceptedBetQueue } = this.state;
        delete acceptedBetQueue[key];
        this.setState({ acceptedBetQueue });
    }

    setUserStakeLevel = (payload: any) => {
        if (payload.userStakeLevel) {
            this.setState({ userStakeLevel: payload.userStakeLevel });
        }
    };

    handleUserStakeLevel({ userStakeLevel }) {
        this.setState({ userStakeLevel });
        gameVipIds.includes(this.props.id) &&
            this.setState({ notice: { message: this.props.t(`common:${CommonResourceKeys.USER_STAKE_LEVEL_UPDATE}`), duration: 2 } });
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
        const { durations } = this.props;
        const { language } = this.context.session;
        if (um && remainingTime && remainingTime + 1 === durations.wholeRound) {
            this.isUMInFirstLoad = true;
        } else {
            this.isUMInFirstLoad = false;
        }

        if (um && (this.timeCounter <= durations.placingBets + durations.beforeStartRound || remainingTime + 1 === durations.wholeRound)) {
            this.interval && clearInterval(this.interval);
            this.showWaitingTimeout && clearTimeout(this.showWaitingTimeout);
            this.setState({
                gameState: GameState.Disabled,
                disabledMessage: um_message[language],
                showWaitingTime: false,
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

        const newState = {
            gameState: newGameState,
            ...this.getStateByNextGameState(newGameState),
        };

        this.setState(newState);
    }

    getStateByNextGameState(nextGameState: GameState) {
        const { roundId, gameState, displayPopup } = this.state;

        const timeCounter = this.getTimeCounter(this.timeCounter, nextGameState);

        const newStateDetector = [
            {
                condition: [GameState.BeforeStartRound, GameState.InRound].includes(nextGameState) && gameState !== nextGameState,
                state: {
                    ownBets: {},
                    totalBets: {},
                    showWaitingTime: false,
                    betPercentage: {},
                    displayChips: {},
                    showWinningBet: false,
                    isShowBlink: false,
                },
            },
            {
                condition: gameState !== GameState.InRound && nextGameState === GameState.InRound,
                state: {
                    roundId: roundId + 1,
                },
            },
            {
                condition: nextGameState === GameState.LockingBet && [PopupType.Rebet, PopupType.PlaceBet].includes(displayPopup),
                state: {
                    displayPopup: null,
                    notice: null,
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
        const { username, ss } = this.context.session;
        const balanceResponse = await this.authService.getBalance(ss, username);

        if (balanceResponse.isSuccessful) {
            this.context.setBalance(balanceResponse.balance);
        } else {
            this.setState({
                displayPopup: PopupType.Error,
                errorMessage: GetLocalizedErrorMessage(balanceResponse.errorCode),
            });
        }
    }

    handleGameConfigs({ gameConfigs }) {
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

        if (remainingTime > durations.placingBets + (durations.beforeStartRound ?? 0)) {
            return GameState.Waiting;
        }

        if (durations.beforeStartRound && remainingTime > durations.placingBets) {
            return GameState.BeforeStartRound;
        }

        if (remainingTime <= durations.placingBets && remainingTime > durations.lockingBet) {
            return GameState.InRound;
        }

        if (remainingTime <= durations.lockingBet && remainingTime >= 0) {
            this.setState({ isShowBlink: true });
            return GameState.LockingBet;
        }

        return GameState.None;
    }

    getTimeCounter(remainingTime: number, gameState: GameState) {
        const { durations } = this.props;

        switch (gameState) {
            case GameState.Waiting:
                return remainingTime - (durations.placingBets + (durations.beforeStartRound ?? 0));
            case GameState.InRound:
            case GameState.LockingBet:
                return remainingTime;
            default:
                return 0;
        }
    }

    handleRoundHistory({ roundHistory }) {
        const { gameState } = this.state;

        const lastRoundId = roundHistory[0] ? roundHistory[0].roundId : 0;
        const roundId = ![GameState.InRound, GameState.LockingBet].includes(gameState) ? lastRoundId : lastRoundId + 1;
        const displayChips = this.getUserBetChipsOnStorage(roundId);

        this.setState({
            roundHistory,
            roundId,
            result: roundHistory[0]?.result,
            settlementResult: roundHistory[0]?.settlementResult,
            displayChips,
        });

        this.setWinStreakByRoundHistory(roundHistory);
    }

    handleFinish({ finish }) {
        const { roundHistory } = this.state;
        const { durations } = this.props;
        const roundHistoryClone = [...roundHistory];

        this.isProcessingBet = false;
        this.storeOwnBet(finish.roundId);
        roundHistoryClone.unshift(finish);
        roundHistoryClone.pop();

        this.setState({
            playResultAnimation: true,
            result: finish.result,
            settlementResult: finish.settlementResult,
        });

        const animationDuration = (durations.resultAnimation + (durations.balancingBet ?? 0)) * 1000;

        this.showWaitingTimeout = setTimeout(() => {
            this.setState({ showWaitingTime: true, isShowBlink: false, roundHistory: roundHistoryClone });
            this.notifyWinStreakByLatestSettlementResult(finish.settlementResult);
        }, animationDuration);
        this.runGame(durations.wholeRound);
    }

    getUserBetChipsOnStorage(roundId: number) {
        const { id } = this.props;
        const userBetChips = LocalStorageManager.getLocalStorageItem<UserBetChipStorageModal>(userBetChipsKey);

        return userBetChips && userBetChips[id]?.roundId === roundId ? userBetChips[id].chips : {};
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

    openPlaceBetModal(betChoice: string) {
        this.setState({ displayPopup: PopupType.PlaceBet, selectedBetChoice: betChoice });
    }

    placeBet(betChoice: string, amount: number) {
        const { displayPopup } = this.state;

        if (this.isProcessingBet && displayPopup !== PopupType.Rebet) {
            this.setState({ notice: { message: this.props.t("messages:betProcessing"), duration: 2 } });
        } else {
            if (amount > 0) {
                this.isProcessingBet = true;
                this.socket.emit("bet", { betChoice, amount });
            }
        }
    }

    openPopup(popupType: PopupType) {
        this.setState({ displayPopup: popupType });
    }

    updateModeView(mode: ModeView) {
        this.setState({ modeView: mode });
    }

    renderErrorMessage() {
        return (
            <BaseDialog type={ModalType.Center} isOpen={this.state.displayPopup === PopupType.Error} onCloseModal={() => this.closePopup()}>
                <ErrorMessage message={this.state.errorMessage} closeModal={() => this.closePopup()}></ErrorMessage>
            </BaseDialog>
        );
    }

    renderReBet() {
        const betContainerRef = this.gameContainerRef;
        const domRect = betContainerRef.current.getBoundingClientRect();
        const betContainerPosition = domRect.y;

        return (
            <BaseDialog
                betContainerPosition={isMobileOnly ? betContainerPosition : null}
                type={ModalType.Top}
                isOpen={this.state.displayPopup === PopupType.Rebet}
                onCloseModal={() => this.closePopup()}
            >
                <Rebet getOddsByChoice={this.getOddsByChoice.bind(this)} gameId={this.props.id} onCloseModal={() => this.closePopup()} />
            </BaseDialog>
        );
    }

    renderPlaceBet() {
        const { displayPopup, selectedBetChoice, roundId } = this.state;
        const { gameName } = this.props;

        return (
            <PlaceBetModal
                isOpen={displayPopup === PopupType.PlaceBet}
                onCloseModal={() => this.closePopup()}
                onPlaceBet={this.placeBet}
                betChoiceInfo={{
                    betChoice: selectedBetChoice,
                    gameName: gameName,
                    roundId: roundId,
                    odd: this.getOddsByChoice(selectedBetChoice),
                }}
            />
        );
    }

    abstract renderBetOptions(): React.ReactElement;

    abstract renderRoundHistory(): React.ReactElement;

    abstract renderStatistic(): React.ReactElement;

    abstract renderBoard(): React.ReactElement;

    abstract renderResult(): React.ReactElement;

    abstract renderResultCollapse(): React.ReactElement;

    abstract renderGuide(): JSX.Element;

    abstract renderBetHistory(): React.ReactElement;

    abstract getMainOptions(): string[];

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
            case PopupType.Guide:
                return this.renderGuide();
            case PopupType.Rebet:
                return this.renderReBet();
            case PopupType.BetHistory:
                return this.renderBetHistory();
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

    renderGame() {
        const { durations } = this.props;
        const {
            remainingTime,
            roundId,
            gameState,
            totalBets,
            ownBets,
            gameConfigs,
            userStakeLevel,
            modeView,
            displayChips,
            playResultAnimation,
            isShowBlink,
            displayPopup,
        } = this.state;

        const gameContext = {
            totalBets,
            ownBets,
            gameSetting: this.props,
            roundId,
            gameConfigs,
            gameState,
            remainingTime,
            userStakeLevel,
            modeView,
            displayChips,
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
            updateModeView: this.updateModeView,
            playAcceptedBetAnimation: this.playAcceptedBetAnimation,
            finishProcessingBet: () => {
                this.isProcessingBet = false;
            },
            renderResultCollapse: this.renderResultCollapse.bind(this),
        };
        return (
            <GameContextProvider value={gameContext}>
                <GameActionsContextProvider value={gameActionsContext}>
                    <GameHeader />
                    {modeView !== ModeView.collapse && (
                        <>
                            <BetContainer gameState={gameState}>
                                <div
                                    ref={this.gameContainerRef}
                                    className={`${Styles["bet-options"]} ${modeView === ModeView.compact ? Styles["compact-mode"] : ""} ${
                                        Styles[this.props.gameName]
                                    }`}
                                >
                                    {this.renderBetOptions()}
                                </div>

                                {this.isShowStartRoundAnimation && this.renderStartRoundAnimation()}
                                {this.state.gameState === GameState.DisplayResult && this.renderResult()}
                                {this.state.showWaitingTime && (
                                    <WaitingTimeAnimation
                                        remainingTime={
                                            durations.wholeRound -
                                            durations.placingBets -
                                            durations.beforeStartRound -
                                            durations.resultAnimation -
                                            (durations.balancingBet ?? 0) -
                                            1
                                        }
                                    />
                                )}
                                {this.state.gameState === GameState.BalancingBet && <BalancedBettingPool />}
                                {this.state.notice && this.renderNotice()}
                                {this.state.showWinningBet && <WinningBet amount={this.betWin} />}
                                {Object.keys(this.state.acceptedBetQueue).map((key) => (
                                    <AcceptBet key={key} amount={this.state.acceptedBetQueue[key]} />
                                ))}
                            </BetContainer>
                            <div className={`${Styles["mini-round-history"]} d-flex`}>
                                {this.state.roundHistory.length > 0 ? this.renderRoundHistory() : <Spinner color="secondary" />}
                            </div>
                            {modeView === ModeView.full && (
                                <>
                                    <div className={`${Styles["statistic"]} d-flex`}>
                                        {this.state.roundHistory.length > 0 ? this.renderStatistic() : <Spinner color="secondary" />}
                                    </div>
                                    <ScoreboardRoundHistory>
                                        {this.state.roundHistory.length > 0 ? this.renderBoard() : <Spinner color="secondary" />}
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

    render() {
        const { signedIn, gameState, disabledMessage } = this.state;
        return (
            <GameContainer>
                {signedIn ? this.renderGame() : <GameLoading />}
                {gameState === GameState.Disabled && <DisabledModal disabledMessage={disabledMessage} />}
                {gameState === GameState.ConnectFailed && (
                    <ConnectFailedMessage
                        gameName={this.props.t(`${this.props.gameName.toLowerCase()}:${GameResourceKeys.GAME_NAME}`)}
                        retryConnect={this.onStart.bind(this)}
                    />
                )}
            </GameContainer>
        );
    }
}

GameBase.contextType = AuthContext;

export default GameBase;
