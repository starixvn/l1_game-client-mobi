import { WithTranslation, withTranslation } from 'next-i18next';
import React, { useState } from 'react';
import { Container, Navbar, NavbarBrand, NavbarToggler, UncontrolledCollapse } from 'reactstrap';

import { ResourceTypes } from '../../common/resources';
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
        <header className={styles.header}>
            <Navbar expand="md" className={styles["navbar-custom"]}>
                <Container>
                    <UncontrolledCollapse toggler="#navbar" isOpen={isOpen} navbar>
                        <NavbarBrand href="/">
                            <img className={styles.logo} alt="logo" src="/static/images/small-logo.svg" />
                        </NavbarBrand>
                    </UncontrolledCollapse>
                    <NavbarToggler id="navbar" onClick={toggle} />
                    <div className={styles["user-info"]}>
                        <div className="user-name">
                            <span className={`icon-user ${styles["icon-user"]}`}></span>
                            <span>{props.name}</span>
                        </div>
                        <div className={styles.balance}>
                            {props.currency} {props.balance}
                        </div>
                    </div>
                </Container>
            </Navbar>
        </header>
    );
};

export default withTranslation(ResourceTypes.HEADER)(Header);
