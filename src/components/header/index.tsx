import React, { useEffect, useState } from "react";
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
    const [isBalanceAnim, setIsBalanceAnim] = useState<boolean>(false);
    const pathAvatar = `/static/images/avatar/${props.avatarId}.png`;
    useEffect(() => {
        setIsBalanceAnim(true);
        const timeOut = setTimeout(() => setIsBalanceAnim(false), 1000);

        return () => {
            clearTimeout(timeOut);
        };
    }, [props.balance]);

    return (
        <header className={Styles.header}>
            <div className="game-container d-flex">
                <Navbar expand="md" className={Styles["navbar-custom"]}>
                    <div className={Styles["header-container"]}>
                        <div className={Styles["logo"]}>
                            <img src={`/static/images/logo-custom-saba.svg`} className="img-fluid" alt="logo" />
                        </div>
                        <div className={Styles["user"]}>
                            <div className={Styles["info"]}>
                                <div className={Styles["user-name"]}>{props.name}</div>
                                <div className={`${Styles.balance} ${isBalanceAnim ? "heart-beat-animation" : ""}`}>
                                    {numberWithCommas(props.balance)} {props.currency}
                                </div>
                            </div>
                            <div className={Styles["avatar"]}>
                                {props.avatarId > 0 && props.avatarId < 41 ? (
                                    <img src={pathAvatar} className="img-fluid" alt="Avatar" />
                                ) : (
                                    <span className={`icon-user ${Styles["icon-user"]}`}></span>
                                )}
                            </div>
                        </div>
                    </div>
                </Navbar>
            </div>
        </header>
    );
};

export default Header;
