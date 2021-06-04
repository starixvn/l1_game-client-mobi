import { WithRouterProps } from "next/dist/client/with-router";
import { NextRouter, withRouter } from "next/router";
import React from "react";
import { isMobileOnly } from "react-device-detect";
import Auth, { AuthorizeResponse, User } from "sc-user-service-client/dist/auth";
import { UMInfo } from "sc-user-service-client/dist/settings";
import UserSettings from "sc-user-service-client/dist/userSettings";
import { withTranslation, WithTranslation, Trans } from "react-i18next";
import appSettings from "../../common/app-settings";
import * as LocalStorageManager from "../../common/local-storage";
import LandscapeMode from "../../components/landscape-mode";
import { AuthContext } from "../../contexts/auth";
import { RoundResultContextProvider } from "../../contexts/round-result";
import { UserClientCommunication } from "../../services";
import { setCharacterName } from "../../utils/sentry";
import Games from "../games/games";
import Header from "../header";
import Register from "../register";
import BaseDialog from "../shared/base-dialog";
import { ModalType } from "../shared/base-dialog/type";
import Welcome from "../welcome";
import { GetLocalizedErrorMessage } from "../../helpers/notice-helper";
import { APIErrorProp } from "../../pages";
import Styles from "./dashboard.module.scss";

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
};

const LanguageMapper = {
    en: "en-US",
    vi: "vi-VN",
};

const orientationType = { portrait: "portrait", landscape: "landscape" };
class Dashboard extends React.Component<Props, State> {
    authService: Auth = null;
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
        };

        this.handleRegister = this.handleRegister.bind(this);
        this.onSocketConnect = this.onSocketConnect.bind(this);
        this.onSocketData = this.onSocketData.bind(this);
        this.handleKickedOut = this.handleKickedOut.bind(this);
        this.forceReload = this.forceReload.bind(this);
        this.doOnOrientationChange = this.doOnOrientationChange.bind(this);
        this.authService = UserClientCommunication.getUserClientInstance().auth;
        this.userSettingsService = UserClientCommunication.getUserClientInstance().userSettings;
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

        if (data.reload) {
            this.forceReload();
        }

        if (data.apiError) {
            this.props.setApiErrorMessage({
                message: GetLocalizedErrorMessage(data.apiError.errorCode),
                errorCode: data.apiError.errorCode,
            });
            this.props.setIsShowModal(true);
        }
    }

    forceReload() {
        window.location.reload();
    }

    handleKickedOut(data: any) {
        const { umInfo } = data;
        const { router } = this.props;
        LocalStorageManager.removeLocalStorageItem(LocalStorageManager.localStorageKeys.session);

        if (umInfo) {
            LocalStorageManager.storeLocalStorageItem<UMInfo>(LocalStorageManager.localStorageKeys.umInfo, {
                time: umInfo.startTime,
                start: umInfo.startTime,
                end: umInfo.endTime,
                finish: false,
            });
            3001;
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

    getRoundResultUrl(gameId: number) {
        const data = { language: LanguageMapper[this.props.router.locale], gameId };
        this.sendMessage({ gameResult: data });
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

    renderDashBoard() {
        const { authorizeInfo } = this.props;
        const { user } = this.state;
        const props = { ...user, balance: this.props.balance };

        return (
            <div className={Styles["dashboard"]}>
                <Header {...props} />
                <RoundResultContextProvider value={{ getRoundResultUrl: this.getRoundResultUrl.bind(this) }}>
                    <Games quickBetSetting={authorizeInfo?.user?.settings?.quickBet} />
                </RoundResultContextProvider>
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
                                <div>{this.props.apiErrorMessage}</div>
                                <Trans t={this.props.t}>
                                    {this.props.t(this.props.apiErrorMessage.message, { errorCode: this.props.apiErrorMessage.errorCode })}
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
