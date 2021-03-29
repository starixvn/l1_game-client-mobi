import React from "react";
import { Container } from "reactstrap";

import { AuthContext } from "../../contexts/auth";
import { UserClientCommunication } from "../../services";
import Auth, { SSOResponse, User } from "sc-user-service-client/dist/auth";
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
        this.authService = UserClientCommunication.getUserClientInstance();
    }

    async componentDidMount() {
        const session: SSOResponse = this.context;
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
                <Container>
                    <Header {...props} />
                    <Games />
                </Container>
            );
        }
    }
}

Dashboard.contextType = AuthContext;

export default Dashboard;
