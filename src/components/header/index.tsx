import React, { useState } from "react";
import { Navbar, NavbarBrand, NavbarToggler, UncontrolledCollapse } from "reactstrap";

import { numberWithCommas } from "../../helpers/NumberHelper";
import Styles from "./header.module.scss";

type Props = {
    UID: number;
    avatarId: number;
    currency: string;
    name: string;
    balance: number;
};

const Header: React.FC<Props> = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    return (
        <header className={Styles.header}>
            <div className="game-container">
                <Navbar expand="md" className={Styles["navbar-custom"]}>
                    <div className={Styles["header-container"]}>
                        <UncontrolledCollapse toggler="#navbar" isOpen={isOpen} navbar>
                            <NavbarBrand href="/">
                                <img className={Styles.logo} alt="logo" src="/static/images/small-logo.svg" />
                            </NavbarBrand>
                        </UncontrolledCollapse>
                        <NavbarToggler id="navbar" onClick={toggle} />
                        <div className={Styles["user-info"]}>
                            <div className="user-name">
                                <span className={`icon-user ${Styles["icon-user"]}`}></span>
                                <span>{props.name}</span>
                            </div>
                            <div className={Styles.balance}>
                                {numberWithCommas(props.balance)} {props.currency}
                            </div>
                        </div>
                    </div>
                </Navbar>
            </div>
        </header>
    );
};

export default Header;
