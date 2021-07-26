import { Trans, WithTranslation, withTranslation } from "next-i18next";
import { WithRouterProps } from "next/dist/client/with-router";
import { NextRouter, withRouter } from "next/router";
import React from "react";
import { isMobileOnly } from "react-device-detect";
import { AuthorizeResponse, User } from "sc-user-service-client/dist/auth";
import { UMInfo } from "sc-user-service-client/dist/settings";
import UserSettings from "sc-user-service-client/dist/userSettings";

import appSettings from "../../common/app-settings";
import { getLocalStorageItem, localStorageKeys, storeLocalStorageItem } from "../../common/local-storage";
import { getSessionStorageItem, SessionStorageKeys, storeSessionStorageItem } from "../../common/session-storage";
import LandscapeMode from "../../components/landscape-mode";
import { AuthContext } from "../../contexts/auth";
import { APIErrorProp } from "../../pages";
import { UserClientCommunication } from "../../services";
import { setCharacterName } from "../../utils/sentry";
import Games from "../games/games";
import Header from "../header";
import BaseDialog from "../shared/base-dialog";
import { ModalType } from "../shared/base-dialog/type";
import { BetSetting, BetSettingStorage } from "../shared/bet-settings/type";
import { UserStakeLevel } from "../shared/game-base/type";
import { Settings } from "../shared/settings";
import Styles from "./dashboard.module.scss";
import { GameGuideModal } from "./game-guide-modal";
import { HistoryModal } from "./history";
import Register from "./register";
import Welcome from "./welcome";

type Props = {
    balance: number;
    authorizeInfo: AuthorizeResponse;
    router: NextRouter;
    apiErrorMessage: APIErrorProp;
    isShowErrorModal: boolean;
    setApiErrorMessage: (APIErrorProp) => void;
    setIsShowModal: (isOpen: boolean) => void;
} & WithRouterProps &
    WithTranslation;

type State = {
    isSignedUp: boolean;
    isSignedIn: boolean;
    isShowNotice: boolean;
    isShowHistory: boolean;
    isShowGuide: boolean;
    notice: string;
    user: User;
    orientation: string;
    enabledWinningStreakNotification: boolean;
    enabledPlaySound: boolean;
    betSettings: BetSettingStorage;
    userStakeLevel: UserStakeLevel;
};

const orientationType = { portrait: "portrait", landscape: "landscape" };
class Dashboard extends React.PureComponent<Props, State> {
    userSettingsService: UserSettings = null;
    private mainSocket: WebSocket = null;

    constructor(props: Props) {
        super(props);

        this.state = {
            isSignedUp: true,
            user: null,
            isShowNotice: true,
            isSignedIn: props.authorizeInfo?.user?.isSignedInSM,
            isShowHistory: false,
            isShowGuide: false,
            notice: "",
            orientation: "",
            enabledWinningStreakNotification: getLocalStorageItem(localStorageKeys.winningStreakNotification) ?? true,
            enabledPlaySound: getLocalStorageItem(localStorageKeys.playSound) ?? false,
            betSettings: getSessionStorageItem(SessionStorageKeys.betSetting) ?? {},
            userStakeLevel: { minBet: 0, maxBet: 0 },
        };

        this.userSettingsService = UserClientCommunication.getUserClientInstance().userSettings;

        this.handleRegister = this.handleRegister.bind(this);
        this.onSocketConnect = this.onSocketConnect.bind(this);
        this.onSocketData = this.onSocketData.bind(this);
        this.handleKickedOut = this.handleKickedOut.bind(this);
        this.doOnOrientationChange = this.doOnOrientationChange.bind(this);
        this.winningStreakNotificationToggle = this.winningStreakNotificationToggle.bind(this);
        this.playSoundToggle = this.playSoundToggle.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.updateBetSetting = this.updateBetSetting.bind(this);
        this.toggleHistoryModal = this.toggleHistoryModal.bind(this);
        this.toggleGuideModal = this.toggleGuideModal.bind(this);
    }

    doOnOrientationChange() {
        switch (window.orientation) {
            case -90:
            case 90:
                this.setState({ orientation: "landscape" });
                break;
            default:
                this.setState({ orientation: "portrait" });
                break;
        }
    }

    async componentDidMount() {
        const { authorizeInfo } = this.props;
        this.mainSocket = this.connectMainSocket();

        authorizeInfo.authorized ? this.setState({ user: authorizeInfo.user, isSignedUp: true }) : this.setState({ isSignedUp: false });
        window.addEventListener("orientationchange", this.doOnOrientationChange);
        this.doOnOrientationChange();
    }

    componentWillUnmount() {
        this.mainSocket.close();
        window.removeEventListener("orientationchange", this.doOnOrientationChange);
    }

    handleRegister(user: User, theme: string) {
        const { session, setBalance } = this.context;

        Object.assign(user, { settings: { theme } });

        this.userSettingsService.updateSignInSMStatus(session.ss, session.username);
        this.userSettingsService.updateUserThemeSetting(session.ss, session.username, theme);
        this.setState({ isSignedUp: true, isSignedIn: true, user });
        setBalance(user?.red);
        setCharacterName(user?.name);
    }

    sendMessage(data: any) {
        this.mainSocket.readyState === 1 && this.mainSocket.send(JSON.stringify(data));
    }

    connectMainSocket() {
        const { proxy } = appSettings;
        const socketUri = `${proxy.ssl ? "wss" : "ws"}://${proxy.uri + proxy.path}/main/websocket`;
        const socket = new WebSocket(socketUri);
        socket.onopen = this.onSocketConnect;
        socket.onmessage = this.onSocketData;

        return socket;
    }

    onSocketConnect() {
        const { session } = this.context;
        const authentication = { username: session.username, data: session };
        setTimeout(() => {
            this.sendMessage({ authentication });
        }, 500);
    }

    onSocketData(message: any) {
        const data = JSON.parse(message.data);
        if (data.kickedOut) {
            this.handleKickedOut(data.kickedOut);
        }

        if (data.apiError) {
            this.props.setApiErrorMessage(data.apiError.errorCode);
            this.props.setIsShowModal(true);
        }

        if (data.userStakeLevel) {
            this.setState({ userStakeLevel: data.userStakeLevel });
        }
    }

    handleKickedOut(data: any) {
        const { umInfo } = data;
        const { router, i18n } = this.props;

        if (umInfo) {
            storeLocalStorageItem<UMInfo>(localStorageKeys.umInfo, {
                time: umInfo.startTime,
                start: umInfo.startTime,
                end: umInfo.endTime,
                finish: false,
            });
            setTimeout(() => {
                router.push("/um", "/um", { locale: i18n.language });
            }, 500);
        } else {
            router.push("/timeout");
        }
    }

    handleFirstLogin(theme: string) {
        const { session } = this.context;
        const { user } = this.state;

        Object.assign(user, { settings: { theme } });

        this.userSettingsService.updateSignInSMStatus(session.ss, session.username);
        this.userSettingsService.updateUserThemeSetting(session.ss, session.username, theme);
        this.setState({ isSignedIn: true, user });
    }

    getRenderComponent(isSignedUp: boolean, isSignedIn: boolean) {
        const strategies = [
            {
                condition: !isSignedUp,
                result: this.renderRegister(),
            },
            {
                condition: isSignedUp && !isSignedIn,
                result: this.renderWelcome(),
            },
            {
                condition: isSignedUp && isSignedIn,
                result: this.renderDashBoard(),
            },
        ];

        return strategies.find((strategy) => strategy.condition === true).result;
    }

    renderRegister() {
        return <Register handleStateLogin={(user: User, theme: string) => this.handleRegister(user, theme)}></Register>;
    }

    renderWelcome() {
        const { user } = this.state;

        return <Welcome userInfo={user} handleFirstLoginSM={(theme) => this.handleFirstLogin(theme)}></Welcome>;
    }

    winningStreakNotificationToggle() {
        const { enabledWinningStreakNotification } = this.state;
        this.setState({ enabledWinningStreakNotification: !enabledWinningStreakNotification });
        storeLocalStorageItem(localStorageKeys.winningStreakNotification, !enabledWinningStreakNotification);
    }

    playSoundToggle() {
        const { enabledPlaySound } = this.state;
        this.setState({ enabledPlaySound: !enabledPlaySound });
        storeLocalStorageItem(localStorageKeys.playSound, !enabledPlaySound);
    }

    updateBetSetting(setting: BetSetting, gameId?: number) {
        const { betSettings } = this.state;

        if (gameId) {
            betSettings[gameId] = setting;
        } else {
            appSettings.offeredGames.forEach((id) => {
                betSettings[id] = setting;
            });
            betSettings["global"] = setting;
        }

        this.setState({ betSettings: { ...betSettings } });
        storeSessionStorageItem(SessionStorageKeys.betSetting, betSettings);
    }

    closeDialog() {
        this.props.setIsShowModal(false);
    }

    toggleHistoryModal() {
        this.setState({ isShowHistory: !this.state.isShowHistory });
    }

    toggleGuideModal() {
        this.setState({ isShowGuide: !this.state.isShowGuide });
    }

    get globalBetSetting(): BetSetting {
        const setting = this.state.betSettings["global"];

        return {
            betStake: setting?.betStake,
            enabledQuickBet: setting?.enabledQuickBet,
        };
    }

    renderDashBoard() {
        const { apiErrorMessage, balance, isShowErrorModal } = this.props;
        const { user, enabledWinningStreakNotification, enabledPlaySound, betSettings, isShowGuide, isShowHistory, userStakeLevel } =
            this.state;
        const { avatarId, name, currency } = user ?? {};

        return (
            <div className={Styles["dashboard"]}>
                <Header
                    avatarId={avatarId}
                    name={name}
                    balance={balance}
                    currency={currency}
                    enabledNotification={enabledWinningStreakNotification}
                    enabledSound={enabledPlaySound}
                    onToggleNotification={this.winningStreakNotificationToggle}
                    onToggleSound={this.playSoundToggle}
                    updateBetSetting={this.updateBetSetting}
                    globalBetSetting={this.globalBetSetting}
                    toggleHistoryModal={this.toggleHistoryModal}
                    toggleGuideModal={this.toggleGuideModal}
                />
                {isMobileOnly && (
                    <div className={Styles["settings-container"]}>
                        <Settings
                            enabledSound={enabledPlaySound}
                            enabledNotification={enabledWinningStreakNotification}
                            onToggleNotification={this.winningStreakNotificationToggle}
                            onToggleSound={this.playSoundToggle}
                            updateBetSetting={this.updateBetSetting}
                            globalBetSetting={this.globalBetSetting}
                            toggleHistoryModal={this.toggleHistoryModal}
                            toggleGuideModal={this.toggleGuideModal}
                        />
                    </div>
                )}
                <Games
                    enabledWinningStreakNotification={enabledWinningStreakNotification}
                    enabledPlaySound={enabledPlaySound}
                    setApiErrorMessage={this.props.setApiErrorMessage}
                    betSettings={betSettings}
                    updateBetSetting={this.updateBetSetting}
                    userStakeLevel={userStakeLevel}
                />
                {isShowHistory && <HistoryModal onCloseModal={this.toggleHistoryModal} />}
                {isShowGuide && <GameGuideModal userStakeLevel={userStakeLevel} onCloseModal={this.toggleGuideModal} />}
                {isShowErrorModal && (
                    <div className={Styles["container-modal"]}>
                        <div className={Styles["bg-opacity"]}></div>
                        <BaseDialog type={ModalType.Center} isOpen={isShowErrorModal} onCloseModal={this.closeDialog}>
                            <div className="modal-center">
                                <div className={`icon-warning modal-icon-warning`}></div>
                                <div className={`icon-close modal-icon-close`} onClick={this.closeDialog}></div>

                                <Trans t={this.props.t}>
                                    {this.props.t(apiErrorMessage?.message, { errorCode: apiErrorMessage?.errorCode })}
                                </Trans>
                            </div>
                        </BaseDialog>
                    </div>
                )}
            </div>
        );
    }

    render() {
        const { isSignedUp, isSignedIn, orientation } = this.state;

        return orientation === orientationType.landscape && isMobileOnly ? (
            <LandscapeMode />
        ) : (
            this.getRenderComponent(isSignedUp, isSignedIn)
        );
    }
}

Dashboard.contextType = AuthContext;

export default withRouter(withTranslation()(Dashboard));
