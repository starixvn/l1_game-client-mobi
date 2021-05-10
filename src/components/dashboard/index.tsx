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

type Props = {
    balance: number;
    updateBalance: (balance: number) => void;
    router: NextRouter;
} & WithRouterProps;

type State = {
    isFistLogin: boolean;
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
            isFistLogin: false,
            user: null,
        };

        this.handleStateLogin = this.handleStateLogin.bind(this);
        this.onSocketData = this.onSocketData.bind(this);
        this.handleKickedOut = this.handleKickedOut.bind(this);
        this.authService = UserClientCommunication.getUserClientInstance().auth;
    }

    async componentDidMount() {
        const { session } = this.context;
        const response = await this.authService.authorize(session.ss, session.username);
        this.mainSocket = this.connectMainSocket();

        const authorizeResponse = response as AuthorizeResponse;
        if (authorizeResponse.authorized) {
            this.handleStateLogin(authorizeResponse.user);
        } else {
            this.setState({ isFistLogin: true });
        }
    }

    componentWillUnmount() {
        this.mainSocket.close();
    }

    handleStateLogin(user: User) {
        this.props.updateBalance(user.red);
        const { session } = this.context;
        const authentication = { username: session.username, data: session };

        setTimeout(() => {
            this.sendMessage({ authentication });
        }, 500);
        this.setState({ isFistLogin: false, user });
    }

    sendMessage(data: any) {
        this.mainSocket.readyState === 1 && this.mainSocket.send(JSON.stringify(data));
    }

    connectMainSocket() {
        const socketUri = `${appSettings.ssl ? "wss" : "ws"}://${appSettings.proxyUrl}/websocket`;
        const socket = new WebSocket(socketUri);
        socket.onmessage = this.onSocketData;

        return socket;
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
        const { isFistLogin, user } = this.state;
        if (isFistLogin) {
            return <Register handleStateLogin={this.handleStateLogin}></Register>;
        } else {
            const props = { ...user, balance: this.props.balance };
            return (
                <div>
                    <Header {...props} />
                    <RoundResultContextProvider value={{ getRoundResultUrl: this.getRoundResultUrl.bind(this) }}>
                        <Games />
                    </RoundResultContextProvider>
                </div>
            );
        }
    }
}

Dashboard.contextType = AuthContext;

export default withRouter(Dashboard);
