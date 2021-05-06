import React, { useEffect } from "react";
import { useCountUp } from "react-countup";
import { Navbar } from "reactstrap";

import { numberWithCommas } from "../../helpers/number-helper";
import Styles from "./header.module.scss";

type Props = {
    UID: number;
    avatarId: number;
    currency: string;
    name: string;
    balance: number;
};

const Header: React.FC<Props> = (props) => {
    const { countUp, update } = useCountUp({
        end: props.balance,
    });

    useEffect(() => {
        update(props.balance);
    }, [props.balance]);

    return (
        <header className={Styles.header}>
            <div className="game-container d-flex">
                <Navbar expand="md" className={Styles["navbar-custom"]}>
                    <div className={Styles["header-container"]}>
                        <div className={Styles["user-info"]}>
                            <div className="user-name">
                                <span className={`icon-user ${Styles["icon-user"]}`}></span>
                                <span>{props.name}</span>
                            </div>
                            <div className={Styles.balance}>
                                {countUp ? numberWithCommas(+countUp) : 0} {props.currency}
                            </div>
                        </div>
                    </div>
                </Navbar>
            </div>
        </header>
    );
};

export default Header;
