import { WithTranslation, withTranslation } from 'next-i18next';
import React, { useState } from 'react';
import { Container, Navbar, NavbarBrand, NavbarToggler, UncontrolledCollapse } from 'reactstrap';

import { HeaderResourceKeys, ResourceTypes } from '../../common/resources';
import styles from './header.module.scss';

type Props = {
    UID: number;
    avatarId: number;
    currency: string;
    name: string;
    balance: number;
} & WithTranslation;

const Header: React.FC<Props> = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    return (
        <header>
            <Navbar color="light" light expand="md">
                <Container>
                    <UncontrolledCollapse toggler="#navbar" isOpen={isOpen} navbar>
                        <NavbarBrand href="/">
                            <img className={styles.logo} alt="logo" src="/static/images/Logo.png" />
                        </NavbarBrand>
                    </UncontrolledCollapse>
                    <NavbarToggler id="navbar" onClick={toggle} />
                    <div className={styles["user-info"]}>
                        <div className="user-name">
                            <label>
                                <span className="icon-user"></span>
                                {props.t(HeaderResourceKeys.ACCOUNT)}:
                            </label>
                            <span>{props.name}</span>
                        </div>
                        <div className="balance">
                            <label>{props.t(HeaderResourceKeys.BALANCE)}:</label>
                            <span>
                                {props.currency} {props.balance}
                            </span>
                        </div>
                    </div>
                </Container>
            </Navbar>
        </header>
    );
};

export default withTranslation(ResourceTypes.HEADER)(Header);
