import React from "react";
import { Container } from "reactstrap";

import { UserService } from "../../services";
import { Session, User } from "../../services/user/user";
import { AuthContext } from "../contexts/auth";
import Games from "../games";
import Header from "../header";
import Register from "../shared/register";

type Props = {
    balance: number;
    updateBalance: (balance: number) => void;
};

type State = {
    isFistLogin: boolean;
    user: User;
};

class Dashboard extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            isFistLogin: false,
            user: null,
        };

        this.handleStateLogin = this.handleStateLogin.bind(this);
    }

    async componentDidMount() {
        const session: Session = this.context;
        const response = await UserService.authorize(session);

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
