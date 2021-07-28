import { Trans, WithTranslation, withTranslation } from "next-i18next";
import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";
import React from "react";
import { isMobileOnly } from "react-device-detect";
import { AuthorizeResponse, ReCheckInResponse, SSOResponse } from "sc-user-service-client/dist/auth";
import { UMInfo } from "sc-user-service-client/dist/settings";

import appSettings from "../../common/app-settings";
import { getLocalStorageItem, localStorageKeys, storeLocalStorageItem } from "../../common/local-storage";
import { getSessionStorageItem, SessionStorageKeys, storeSessionStorageItem } from "../../common/session-storage";
import LandscapeMode from "../../components/landscape-mode";
import { AuthContextProvider } from "../../contexts/auth";
import { GetLocalizedErrorMessage } from "../../helpers/notice-helper";
import { authorize, reCheckIn, updateSignInSMStatus, updateThemeSetting } from "../../services/auth-service";
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
    session: SSOResponse;
    buildId: string;
} & WithRouterProps &
    WithTranslation;

type APIErrorProp = {
    message: string;
    errorCode: string;
};

type State = {
    orientation: string;
    enabledWinningStreakNotification: boolean;
    enabledPlaySound: boolean;
    betSettings: BetSettingStorage;
    userStakeLevel: UserStakeLevel;
    authorizeInfo: AuthorizeResponse;
    isShowErrorModal: boolean;
    apiError: APIErrorProp;
    isShowHistory: boolean;
    isShowGuide: boolean;
    isShowFavoriteSetting: boolean;
};

const orientationType = { portrait: "portrait", landscape: "landscape" };
class Dashboard extends React.PureComponent<Props, State> {
    private mainSocket: WebSocket = null;
    private reCheckInInterval: NodeJS.Timeout;

    constructor(props: Props) {
        super(props);

        this.state = {
            orientation: "",
            enabledWinningStreakNotification: getLocalStorageItem(localStorageKeys.winningStreakNotification) ?? true,
            enabledPlaySound: getLocalStorageItem(localStorageKeys.playSound) ?? false,
            betSettings: getSessionStorageItem(SessionStorageKeys.betSetting) ?? {},
            userStakeLevel: { minBet: 0, maxBet: 0 },
            authorizeInfo: null,
            isShowErrorModal: false,
            apiError: null,
            isShowHistory: false,
            isShowGuide: false,
            isShowFavoriteSetting: false,
        };

        this.handleFirstLogin = this.handleFirstLogin.bind(this);
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
        this.handleUpdateUserStakeLevel = this.handleUpdateUserStakeLevel.bind(this);
        this.updateAuthorizeInfo = this.updateAuthorizeInfo.bind(this);
        this.updateUserBalance = this.updateUserBalance.bind(this);
        this.handleShowApiErrorMessage = this.handleShowApiErrorMessage.bind(this);
        this.toggleHistoryModal = this.toggleHistoryModal.bind(this);
        this.toggleGuideModal = this.toggleGuideModal.bind(this);
        this.toggleFavoriteSetting = this.toggleFavoriteSetting.bind(this);

        const buildVersion = getSessionStorageItem(SessionStorageKeys.buildVersion) ?? 0;
        if (props.buildId !== buildVersion) {
            storeSessionStorageItem(SessionStorageKeys.buildVersion, props.buildId);
            window.location.reload(true);
        }
    }

    updateAuthorizeInfo(authorizeInfo: AuthorizeResponse) {
        this.setState({ authorizeInfo });
    }

    updateUserBalance(balance: number) {
        const authorizeInfo = { ...this.state.authorizeInfo };
        if (authorizeInfo && authorizeInfo.authorized && authorizeInfo.user.red !== balance) {
            authorizeInfo.user.red = balance;
            this.setState({ authorizeInfo });
        }
    }

    handleShowApiErrorMessage(errorCode: string) {
        this.setState({ isShowErrorModal: true, apiError: { errorCode, message: GetLocalizedErrorMessage(errorCode) } });
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

    signOut() {
        this.props.router.push("/timeout");
    }

    handleRecheckInResponse(response: ReCheckInResponse) {
        if (!response || !response.isSuccessful) {
            this.signOut();
        } else {
            if (response.apiError) {
                response.isDisableAccount &&
                    setTimeout(() => {
                        this.signOut();
                    }, 10000);

                this.handleShowApiErrorMessage(response.apiError.errorCode);
            } else {
                this.updateUserBalance(response.balance);
            }
        }
    }

    async componentDidMount() {
        const authorizeInfo = (await authorize(this.props.session)) as AuthorizeResponse;
        this.updateAuthorizeInfo(authorizeInfo);
        this.updateUserBalance(authorizeInfo?.user?.red);

        this.reCheckInInterval = setInterval(async () => {
            const reCheckInResponse = await reCheckIn(this.props.session);
            this.handleRecheckInResponse(reCheckInResponse);
        }, 60 * 1000);

        this.mainSocket = this.connectMainSocket();
        window.addEventListener("orientationchange", this.doOnOrientationChange);
        this.doOnOrientationChange();
    }

    componentWillUnmount() {
        this.mainSocket.close();
        clearInterval(this.reCheckInInterval);
        window.removeEventListener("orientationchange", this.doOnOrientationChange);
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
        const { session } = this.props;
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
            this.setState({ isShowErrorModal: true, apiError: data.apiError.errorCode });
        }

        if (data.userStakeLevel) {
            this.handleUpdateUserStakeLevel(data.userStakeLevel);
        }
    }

    handleUpdateUserStakeLevel(userStakeLevel: UserStakeLevel) {
        this.setState({ userStakeLevel: userStakeLevel });
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
        const { session } = this.props;
        const authorizeInfo = { ...this.state.authorizeInfo };

        if (authorizeInfo && authorizeInfo.authorized) {
            updateSignInSMStatus(session);
            updateThemeSetting(session, theme);

            authorizeInfo.user.settings.theme = theme;
            authorizeInfo.user.isSignedInSM = true;

            this.updateAuthorizeInfo(authorizeInfo);
        }
    }

    handleRegister(authorizeInfo: AuthorizeResponse) {
        const { session } = this.props;

        updateSignInSMStatus(session);
        authorizeInfo.user.isSignedInSM = true;
        updateThemeSetting(session, authorizeInfo.user.settings.theme);

        this.updateAuthorizeInfo(authorizeInfo);
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
        this.setState({ isShowErrorModal: false });
    }

    toggleHistoryModal() {
        this.setState({ isShowHistory: !this.state.isShowHistory });
    }

    toggleGuideModal() {
        this.setState({ isShowGuide: !this.state.isShowGuide });
    }

    toggleFavoriteSetting() {
        this.setState({ isShowFavoriteSetting: !this.state.isShowFavoriteSetting });
    }

    get globalBetSetting(): BetSetting {
        const setting = this.state.betSettings["global"];

        return {
            betStake: setting?.betStake,
            enabledQuickBet: setting?.enabledQuickBet,
        };
    }

    renderDashBoard() {
        const {
            enabledWinningStreakNotification,
            enabledPlaySound,
            betSettings,
            isShowErrorModal,
            isShowHistory,
            isShowGuide,
            userStakeLevel,
            isShowFavoriteSetting,
        } = this.state;
        const authContextValue = { session: this.props.session, setBalance: this.updateUserBalance };
        return (
            <AuthContextProvider value={authContextValue}>
                <div className={Styles["dashboard"]}>
                    <Header
                        user={this.state.authorizeInfo.user}
                        enabledNotification={enabledWinningStreakNotification}
                        enabledSound={enabledPlaySound}
                        onToggleNotification={this.winningStreakNotificationToggle}
                        onToggleSound={this.playSoundToggle}
                        updateBetSetting={this.updateBetSetting}
                        globalBetSetting={this.globalBetSetting}
                        toggleHistoryModal={this.toggleHistoryModal}
                        toggleGuideModal={this.toggleGuideModal}
                        toggleFavoriteSetting={this.toggleFavoriteSetting}
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
                                toggleFavoriteSetting={this.toggleFavoriteSetting}
                            />
                        </div>
                    )}
                    <Games
                        enabledWinningStreakNotification={enabledWinningStreakNotification}
                        enabledPlaySound={enabledPlaySound}
                        setApiErrorMessage={this.handleShowApiErrorMessage}
                        betSettings={betSettings}
                        updateBetSetting={this.updateBetSetting}
                        userStakeLevel={userStakeLevel}
                        isShowFavoriteSetting={isShowFavoriteSetting}
                        toggleFavoriteSetting={this.toggleFavoriteSetting}
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
                                        {this.props.t(this.state.apiError?.message, { errorCode: this.state.apiError?.errorCode })}
                                    </Trans>
                                </div>
                            </BaseDialog>
                        </div>
                    )}
                    <div className={Styles["footer"]}>Powered by Saba.club</div>
                </div>
            </AuthContextProvider>
        );
    }

    renderComponents(authorizeInfo: AuthorizeResponse) {
        const { authorized, user } = authorizeInfo;
        if (authorized) {
            return user.isSignedInSM ? (
                this.renderDashBoard()
            ) : (
                <Welcome userInfo={this.state.authorizeInfo.user} handleFirstLoginSM={this.handleFirstLogin} />
            );
        }

        return <Register session={this.props.session} handleStateLogin={this.handleRegister} />;
    }

    render() {
        const { orientation, authorizeInfo } = this.state;

        if (orientation === orientationType.landscape && isMobileOnly) {
            return <LandscapeMode />;
        }

        return authorizeInfo ? this.renderComponents(authorizeInfo) : <></>;
    }
}

export default withRouter(withTranslation()(Dashboard));
