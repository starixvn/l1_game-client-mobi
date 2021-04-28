import React from "react";
import Auth from "sc-user-service-client/dist/auth";
import io from "socket.io-client";

import appSettings from "../../../common/app-settings";
import * as LocalStorageManager from "../../../common/local-storage";
import { AuthContext } from "../../../contexts/auth";
import { GameActionsContextProvider } from "../../../contexts/game-actions-context";
import { GameContextProvider } from "../../../contexts/game-context/game-context";
import { UserClientCommunication } from "../../../services";
import GameContainer from "../../shared/game-container";
import ScoreboardRoundHistory from "../../shared/round-history/scoreboard";
import BaseDialog from "../base-dialog";
import { ModalType } from "../base-dialog/type";
import BetContainer from "../bet-container";
import DisabledModal from "../disabled-modal";
import ErrorMessage from "../error-message";
import PlaceBetModal from "../place-bet-modal/place-bet-modal";
import Rebet from "../rebet";
import WaitingTimeAnimation from "../waiting-time-animation";
import Styles from "./game-base.module.scss";
import MessageTransmitter from "./message-transmitter";
import { MessageTransmitterType } from "./message-transmitter/type";
import { GameBaseProps, GameBaseState, GameState, PopupType, RebetStorageModel } from "./type";

abstract class GameBase<P extends GameBaseProps, S extends GameBaseState<any, any>> extends React.Component<P, S> {
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
        isCompactMode: false,
        showWaitingTime: false,
    };

    constructor(props: P) {
        super(props);

        this.reBetStorageKey = LocalStorageManager.localStorageKeys.rebet;
        this.messageTransmitter = MessageTransmitter();
        this.authService = UserClientCommunication.getUserClientInstance().auth;

        this.registerMessageHandler();
        this.placeBet = this.placeBet.bind(this);
        this.closePopup = this.closePopup.bind(this);
        this.openPopup = this.openPopup.bind(this);
        this.openPlaceBetModal = this.openPlaceBetModal.bind(this);
        this.updateCompactMode = this.updateCompactMode.bind(this);
        this.finishProcessingBet = this.finishProcessingBet.bind(this);
    }

    componentDidMount() {
        const { socketInfo } = this.props;
        const { session } = this.context;
        const socketUri = `${appSettings.ssl ? "https" : "http"}://${appSettings.proxyUrl}/user/${socketInfo.namespace}`;

        this.socket = io(socketUri, {
            forceNew: true,
            transports: ["websocket"],
            upgrade: false,
            path: `/${socketInfo.path}/socket.io`,
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
    }

    componentWillUnmount() {
        this.interval && clearInterval(this.interval);
        this.messageTransmitter.clearAllListener();
        this.socket.disconnect();
    }

    registerMessageHandler = () => {
        this.messageTransmitter.addListener("um", this.handleUM.bind(this));
        this.messageTransmitter.addListener("remainingTime", this.handleRemainingTime.bind(this));
        this.messageTransmitter.addListener("gameConfigs", this.handleGameConfigs.bind(this));
        this.messageTransmitter.addListener("roundHistory", this.handleRoundHistory.bind(this));
        this.messageTransmitter.addListener("finish", this.handleFinish.bind(this));
        this.messageTransmitter.addListener("user", this.handleUserData.bind(this));
        this.messageTransmitter.addListener("totalBets", this.handleTotalBet.bind(this));
        this.messageTransmitter.addListener("ownBets", this.handleOwnBets.bind(this));
        this.messageTransmitter.addListener("betPercentage", this.handlePercentageBets.bind(this));
        this.messageTransmitter.addListener("endBet", this.handleEndBet.bind(this));
        this.messageTransmitter.addListener("apiError", this.handleApiError.bind(this));
    };

    handleStatus = ({ bet, win, winningByChoices }) => {
        win && this.updateUserBalance();
    };

    handleApiError = ({ apiError }) => {
        this.setState({ errorMessage: apiError.message, displayPopup: PopupType.Error });
    };

    handleEndBet = ({ endBet, notice }) => {
        if (this.state.displayPopup !== PopupType.Rebet) {
            this.setState({ isProcessingBet: false });
            endBet === -1 && this.setState({ errorMessage: notice, displayPopup: PopupType.Error });
        }

        this.updateUserBalance();
    };

    setUserStakeLevel = (payload: any) => {
        if (payload.userStakeLevel) {
            this.setState({ userStakeLevel: payload.userStakeLevel });
        }
    };

    handleTotalBet = ({ totalBets }) => {
        this.setState({ totalBets });
    };

    handleOwnBets = ({ ownBets }) => {
        this.setState({ ownBets });
    };

    handlePercentageBets = ({ betPercentage }) => {
        this.setState({ betPercentage });
    };

    handleUserData({ user }) {
        this.context.setBalance(user.red);
    }

    handleUM({ um, um_message }) {
        if (um) {
            this.interval && clearInterval(this.interval);
            this.setState({ gameState: GameState.Disabled, disabledMessage: um_message });
        }
    }

    handleRemainingTime({ remainingTime }) {
        const { gameState } = this.state;

        if (gameState === GameState.None || gameState === GameState.Disabled) {
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

        if (balanceResponse.errorCode === 0) {
            this.context.setBalance(balanceResponse.balance);
        } else {
            this.setState({ displayPopup: PopupType.Error, errorMessage: balanceResponse.errorMessage });
        }
    }

    handleGameConfigs({ gameConfigs }) {
        this.setState({ gameConfigs });
    }

    determineGameState(remainingTime: number) {
        const { durations } = this.props;

        if (remainingTime >= durations.wholeRound - durations.showResult) {
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
        this.setState({
            roundHistory,
            roundId: gameState === GameState.InRound ? lastRoundId + 1 : lastRoundId,
            result: roundHistory[0]?.result,
            settlementResult: roundHistory[0]?.settlementResult,
        });
    }

    handleFinish({ finish }) {
        const { roundHistory } = this.state;
        const { durations } = this.props;

        this.storeOwnBet(finish.roundId);

        roundHistory.unshift(finish);
        roundHistory.pop();
        this.setState({
            result: finish.result,
            settlementResult: finish.settlementResult,
        });

        setTimeout(() => {
            this.setState({ roundHistory, showWaitingTime: true });
        }, durations.resultAnimation * 1000);
        this.runGame(durations.wholeRound);
    }

    storeOwnBet(roundId: number) {
        const { ownBets } = this.state;
        const gameId = this.props.id;
        const rebetStorage = LocalStorageManager.getLocalStorageItem<RebetStorageModel>(this.reBetStorageKey) || {};

        rebetStorage[gameId] = {
            roundId,
            betInfo: Object.keys(ownBets).length > 0 ? ownBets : undefined,
        };

        LocalStorageManager.storeLocalStorageItem(this.reBetStorageKey, rebetStorage);
    }

    openPlaceBetModal(betChoice: string) {
        this.setState({ displayPopup: PopupType.PlaceBet, selectedBetChoice: betChoice });
    }

    placeBet(betChoice: string, amount: number) {
        if (this.state.isProcessingBet) {
            this.setState({ errorMessage: "Cược đang được xử lý. Vui lòng đợi trong giây lát", displayPopup: PopupType.Error });
        } else {
            if (amount > 0) {
                this.socket.emit("bet", { betChoice, amount });
                this.setState({ isProcessingBet: true });
            }
        }
    }

    openPopup(popupType: PopupType) {
        this.setState({ displayPopup: popupType });
    }

    finishProcessingBet() {
        this.setState({ isProcessingBet: false });
    }

    updateCompactMode() {
        this.setState({ isCompactMode: !this.state.isCompactMode });
    }

    renderErrorMessage() {
        return (
            <BaseDialog type={ModalType.Center} isOpen={this.state.displayPopup === PopupType.Error} onCloseModal={() => this.closePopup()}>
                <ErrorMessage message={this.state.errorMessage} closeModal={() => this.closePopup()}></ErrorMessage>
            </BaseDialog>
        );
    }

    renderReBet() {
        return (
            <BaseDialog type={ModalType.Top} isOpen={this.state.displayPopup === PopupType.Rebet} onCloseModal={() => this.closePopup()}>
                <Rebet gameId={this.props.id} onCloseModal={() => this.closePopup()} />
            </BaseDialog>
        );
    }

    renderPlaceBet() {
        const { displayPopup, selectedBetChoice, roundId, gameConfigs } = this.state;
        const { gameName } = this.props;
        const { odds } = gameConfigs;

        return (
            <PlaceBetModal
                isOpen={displayPopup === PopupType.PlaceBet}
                onCloseModal={() => this.closePopup()}
                onPlaceBet={this.placeBet}
                betChoiceInfo={{
                    betChoice: selectedBetChoice,
                    gameName: gameName,
                    roundId: roundId,
                    odd: odds[selectedBetChoice],
                }}
            />
        );
    }

    abstract renderBetOptions(): React.ReactElement;

    abstract renderRoundHistory(): React.ReactElement;

    abstract renderStatistic(): React.ReactElement;

    abstract renderBoard(): React.ReactElement;

    abstract renderResult(): React.ReactElement;

    abstract renderGuide(): JSX.Element;

    abstract renderBetHistory(): React.ReactElement;

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

    get isDisplayResult() {
        return this.state.gameState === GameState.DisplayResult;
    }

    get isShowStartRoundAnimation() {
        return false;
    }

    get isDisabled() {
        return this.state.gameState === GameState.Disabled;
    }

    render() {
        const { durations } = this.props;
        const {
            remainingTime,
            roundId,
            gameState,
            signedIn,
            totalBets,
            ownBets,
            gameConfigs,
            displayPopup,
            userStakeLevel,
            isCompactMode,
            disabledMessage,
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
            isCompactMode,
        };

        const gameActionsContext = {
            placeBet: this.placeBet,
            openPopup: this.openPopup,
            closePopup: this.closePopup,
            handleMessage: this.messageTransmitter.addListener,
            openPlaceBetModal: this.openPlaceBetModal,
            finishProcessingBet: this.finishProcessingBet,
            updateCompactMode: this.updateCompactMode,
        };

        return signedIn ? (
            <GameContextProvider value={gameContext}>
                <GameActionsContextProvider value={gameActionsContext}>
                    <GameContainer>
                        <BetContainer gameState={gameState}>
                            <div className={`${Styles["bet-options"]} ${isCompactMode ? Styles["compact-mode"] : ""}`}>
                                {this.renderBetOptions()}
                            </div>
                            {this.state.showWaitingTime && (
                                <WaitingTimeAnimation
                                    remainingTime={
                                        durations.wholeRound -
                                        durations.placingBets -
                                        durations.beforeStartRound -
                                        durations.resultAnimation -
                                        1
                                    }
                                />
                            )}
                            {this.isShowStartRoundAnimation && this.renderStartRoundAnimation()}
                            {this.isDisplayResult && this.renderResult()}
                        </BetContainer>
                        <div className={`${Styles["mini-round-history"]} d-flex`}>{this.renderRoundHistory()}</div>
                        {!isCompactMode && (
                            <>
                                <div className={`${Styles["statistic"]} d-flex`}>{this.renderStatistic()}</div>
                                <ScoreboardRoundHistory>{this.renderBoard()}</ScoreboardRoundHistory>
                            </>
                        )}
                        {this.renderPopup(displayPopup)}
                        {this.isDisabled && <DisabledModal disabledMessage={disabledMessage} />}
                    </GameContainer>
                </GameActionsContextProvider>
            </GameContextProvider>
        ) : (
            <div>Loading...</div>
        );
    }
}

GameBase.contextType = AuthContext;

export default GameBase;
