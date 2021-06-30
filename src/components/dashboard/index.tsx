import { Trans, WithTranslation, withTranslation } from "next-i18next";
import { WithRouterProps } from "next/dist/client/with-router";
import { NextRouter, withRouter } from "next/router";
import React from "react";
import { isMobileOnly } from "react-device-detect";
import { AuthorizeResponse, User } from "sc-user-service-client/dist/auth";
import { UMInfo } from "sc-user-service-client/dist/settings";
import UserSettings from "sc-user-service-client/dist/userSettings";

import appSettings from "../../common/app-settings";
import { getLocalStorageItem, localStorageKeys, removeLocalStorageItem, storeLocalStorageItem } from "../../common/local-storage";
import LandscapeMode from "../../components/landscape-mode";
import { AuthContext } from "../../contexts/auth";
import { GetLocalizedErrorMessage } from "../../helpers/notice-helper";
import { APIErrorProp } from "../../pages";
import { UserClientCommunication } from "../../services";
import { setCharacterName } from "../../utils/sentry";
import Games from "../games/games";
import Header from "../header";
import BaseDialog from "../shared/base-dialog";
import { ModalType } from "../shared/base-dialog/type";
import Styles from "./dashboard.module.scss";
import Register from "./register";
import Welcome from "./welcome";
import BetSettings from "../bet-settings";
import { Settings } from "../shared/settings";

type Props = {
    balance: number;
    authorizeInfo: AuthorizeResponse;
    router: NextRouter;
    apiErrorMessage: APIErrorProp;
    isShowModal: boolean;
    setApiErrorMessage: (APIErrorProp) => void;
    setIsShowModal: (isOpen: boolean) => void;
} & WithRouterProps &
    WithTranslation;

type State = {
    isSignedUp: boolean;
    isSignedIn: boolean;
    isShowNotice: boolean;
    notice: string;
    user: User;
    orientation: string;
    enabledWinningStreakNotification: boolean;
    enabledPlaySound: boolean;
    enabledQuickBet: boolean;
    betValue: number;
};

const orientationType = { portrait: "portrait", landscape: "landscape" };
class Dashboard extends React.Component<Props, State> {
    userSettingsService: UserSettings = null;
    private mainSocket: WebSocket = null;

    constructor(props: Props) {
        super(props);

        this.state = {
            isSignedUp: true,
            user: null,
            isShowNotice: true,
            isSignedIn: props.authorizeInfo?.user?.isSignedInSM,
            notice: "",
            orientation: "",
            enabledWinningStreakNotification: getLocalStorageItem(localStorageKeys.winningStreakNotification) ?? true,
            enabledPlaySound: getLocalStorageItem(localStorageKeys.playSound) ?? false,
            enabledQuickBet: props.authorizeInfo?.user?.settings?.quickBet,
            betValue: 1,
        };

        this.userSettingsService = UserClientCommunication.getUserClientInstance().userSettings;

        this.handleRegister = this.handleRegister.bind(this);
        this.onSocketConnect = this.onSocketConnect.bind(this);
        this.onSocketData = this.onSocketData.bind(this);
        this.handleKickedOut = this.handleKickedOut.bind(this);
        this.doOnOrientationChange = this.doOnOrientationChange.bind(this);
        this.winningStreakNotificationToggle = this.winningStreakNotificationToggle.bind(this);
        this.playSoundToggle = this.playSoundToggle.bind(this);
        this.setEnabledQuickBet = this.setEnabledQuickBet.bind(this);
        this.setBetValue = this.setBetValue.bind(this);
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

        if (data.gameResult) {
            const { redirectUrl } = data.gameResult;

            const resultPage = window.open(redirectUrl, "", "width=700,height=500");
            resultPage.focus();

            window.onbeforeunload = () => {
                resultPage.close();
            };
        }

        if (data.apiError) {
            this.props.setApiErrorMessage({
                message: GetLocalizedErrorMessage(data.apiError.errorCode),
                errorCode: data.apiError.errorCode,
            });
            this.props.setIsShowModal(true);
        }
    }

    handleKickedOut(data: any) {
        const { umInfo } = data;
        const { router } = this.props;
        removeLocalStorageItem(localStorageKeys.session);

        if (umInfo) {
            storeLocalStorageItem<UMInfo>(localStorageKeys.umInfo, {
                time: umInfo.startTime,
                start: umInfo.startTime,
                end: umInfo.endTime,
                finish: false,
            });
            setTimeout(() => {
                router.push("/um");
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

    setEnabledQuickBet(enabled: boolean) {
        this.setState({ enabledQuickBet: enabled });
    }

    setBetValue(value: number) {
        this.setState({ betValue: value });
    }

    renderDashBoard() {
        const { apiErrorMessage, balance } = this.props;
        const { user, enabledWinningStreakNotification, enabledPlaySound, betValue, enabledQuickBet } = this.state;
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
                />
                {isMobileOnly && (
                    <div className={Styles["settings-container"]}>
                        <Settings
                            enabledSound={enabledPlaySound}
                            enabledNotification={enabledWinningStreakNotification}
                            onToggleNotification={this.winningStreakNotificationToggle}
                            onToggleSound={this.playSoundToggle}
                            enabledOneClickBet={enabledQuickBet}
                            updateEnabledQuickBet={this.setEnabledQuickBet}
                        />
                    </div>
                )}
                <Games
                    enabledWinningStreakNotification={enabledWinningStreakNotification}
                    enabledPlaySound={enabledPlaySound}
                    enabledQuickBet={enabledQuickBet}
                    betValue={betValue}
                />
                <BetSettings
                    enabledQuickBet={enabledQuickBet}
                    updateEnabledQuickBet={this.setEnabledQuickBet}
                    updateBetValue={this.setBetValue}
                    enabledSound={enabledPlaySound}
                />
                {this.props.isShowModal && (
                    <div className={Styles["container-modal"]}>
                        <div className={Styles["bg-opacity"]}></div>
                        <BaseDialog
                            type={ModalType.Center}
                            isOpen={this.props.isShowModal}
                            onCloseModal={() => this.props.setIsShowModal(false)}
                        >
                            <div className="modal-center">
                                <div className={`icon-warning modal-icon-warning`}></div>
                                <div className={`icon-close modal-icon-close`} onClick={() => this.props.setIsShowModal(false)}></div>

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
