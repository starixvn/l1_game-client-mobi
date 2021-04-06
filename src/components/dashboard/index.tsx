import React from "react";
import Auth, { User } from "sc-user-service-client/dist/auth";

import { AuthContext } from "../../contexts/auth";
import { UserClientCommunication } from "../../services";
import Games from "../games/games";
import Header from "../header";
import Register from "../register";

type Props = {
    balance: number;
    updateBalance: (balance: number) => void;
};

type State = {
    isFistLogin: boolean;
    user: User;
};

class Dashboard extends React.Component<Props, State> {
    authService: Auth = null;

    constructor(props: Props) {
        super(props);

        this.state = {
            isFistLogin: false,
            user: null,
        };

        this.handleStateLogin = this.handleStateLogin.bind(this);
        this.authService = UserClientCommunication.getUserClientInstance().auth;
    }

    async componentDidMount() {
        const { session } = this.context;
        const response = await this.authService.authorize(session.ss, session.username);

        if (response.authorized) {
            const user = response.user;
            this.setState({ user });
            this.props.updateBalance(user.red);
        } else {
            this.setState({ isFistLogin: true });
        }
    }

    handleStateLogin() {
        this.setState({ isFistLogin: false });
    }

    render() {
        const { isFistLogin, user } = this.state;

        if (isFistLogin) {
            return <Register handleStateLogin={this.handleStateLogin}></Register>;
        } else {
            const props = { ...user, balance: this.props.balance };
            return (
                <div className="game-container">
                    <Header {...props} />
                    <Games />
                </div>
            );
        }
    }
}

Dashboard.contextType = AuthContext;

export default Dashboard;
