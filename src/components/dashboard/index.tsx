import { WithRouterProps } from "next/dist/client/with-router";
import { NextRouter, withRouter } from "next/router";
import React from "react";
import Auth, { AuthorizeResponse, User } from "sc-user-service-client/dist/auth";
import { UMInfo } from "sc-user-service-client/dist/settings";

import appSettings from "../../common/app-settings";
import * as LocalStorageManager from "../../common/local-storage";
import { AuthContext } from "../../contexts/auth";
import { RoundResultContextProvider } from "../../contexts/round-result";
import { UserClientCommunication } from "../../services";
import Games from "../games/games";
import Header from "../header";
import Register from "../register";
import BaseDialog from "../shared/base-dialog";
import { ModalType } from "../shared/base-dialog/type";
import Styles from "./dashboard.module.scss";

type Props = {
    balance: number;
    authorizeInfo: AuthorizeResponse;
    router: NextRouter;
    apiErrorMessage: string;
    isShowModal: boolean;
    setApiErrorMessage: (message: string) => void;
    setIsShowModal: (isOpen: boolean) => void;
} & WithRouterProps;

type State = {
    isFirstLogin: boolean;
    isShowNotice: boolean;
    notice: string;
    user: User;
};

const LanguageMapper = {
    en: "en-US",
    vi: "vi-VN",
};

class Dashboard extends React.Component<Props, State> {
    authService: Auth = null;
    private mainSocket: WebSocket = null;

    constructor(props: Props) {
        super(props);

        this.state = {
            isFirstLogin: false,
            user: null,
            isShowNotice: true,
            notice: "",
        };

        this.handleStateLogin = this.handleStateLogin.bind(this);
        this.onSocketConnect = this.onSocketConnect.bind(this);
        this.onSocketData = this.onSocketData.bind(this);
        this.handleKickedOut = this.handleKickedOut.bind(this);
        this.forceReload = this.forceReload.bind(this);
        this.authService = UserClientCommunication.getUserClientInstance().auth;
    }

    async componentDidMount() {
        const { authorizeInfo } = this.props;
        this.mainSocket = this.connectMainSocket();

        if (authorizeInfo.authorized) {
            this.handleStateLogin(authorizeInfo.user);
        } else {
            this.setState({ isFirstLogin: true });
        }
    }

    componentWillUnmount() {
        this.mainSocket.close();
    }

    handleStateLogin(user: User) {
        this.setState({ isFirstLogin: false, user });
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
            this.props.setApiErrorMessage(data.apiError.message);
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
            router.push("/um");
        } else {
            router.push("/timeout");
        }
    }

    getRoundResultUrl(gameId: number) {
        const data = { language: LanguageMapper[this.props.router.locale], gameId };
        this.sendMessage({ gameResult: data });
    }

    render() {
        const { authorizeInfo } = this.props;
        const { isFirstLogin, user } = this.state;

        if (isFirstLogin) {
            return <Register handleStateLogin={this.handleStateLogin}></Register>;
        } else {
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
                                </div>
                            </BaseDialog>
                        </div>
                    )}
                </div>
            );
        }
    }
}

Dashboard.contextType = AuthContext;

export default withRouter(Dashboard);
