import React from "react";

import { UserService } from "../../services";
import { Session } from "../../services/user/user";
import { AuthContext } from "../contexts/auth";

type Props = {
    balance: number;
    updateBalance: (balance: number) => void;
};

type State = {
    isFistLogin: boolean;
    user: any;
};

class Dashboard extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            isFistLogin: false,
            user: null,
        };
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

    render() {
        const { isFistLogin } = this.state;
        if (isFistLogin) {
            return <div>Nickname</div>;
        } else {
            return <div>{this.props.balance}</div>;
        }
    }
}

Dashboard.contextType = AuthContext;

export default Dashboard;
