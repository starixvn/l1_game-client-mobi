import React, { useEffect, useState } from "react";
import { Navbar } from "reactstrap";

import { numberWithCommas } from "../../helpers/number-helper";
import Styles from "./header.module.scss";

type Props = {
    avatarId: number;
    currency: string;
    name: string;
    balance: number;
    onOpenSlideNav: () => void;
};

const Header: React.FC<Props> = (props) => {
    const pathAvatar = `/static/images/avatar/${props.avatarId}.png`;

    return (
        <header className={Styles.header}>
            <div className="game-container d-flex">
                <Navbar expand="md" className={Styles["navbar-custom"]}>
                    <div className={Styles["header-container"]}>
                        <div className={Styles["logo"]}>
                            <a href="/">
                                <img src={`/static/images/logo-custom-saba.svg`} className="img-fluid" alt="logo" />
                            </a>
                        </div>
                        <div className="d-flex">
                            <div className={Styles["user"]}>
                                <div className={Styles["info"]}>
                                    <div className={Styles["user-name"]}>{props.name}</div>
                                    <div key={props.balance} className={`${Styles.balance} ${"heart-beat-animation"}`}>
                                        {numberWithCommas(props.balance ? props.balance : 0)} {props.currency}
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
                            <span onClick={props.onOpenSlideNav} className={`icon-menu ${Styles["icon-menu"]}`}></span>
                        </div>
                    </div>
                </Navbar>
            </div>
        </header>
    );
};

export default Header;
