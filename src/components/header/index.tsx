import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle, Navbar } from "reactstrap";

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
    const toggleName = { vi: "VN", en: "EN" };
    const router = useRouter();
    const { locale } = router;
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const [isBalanceAnim, setIsBalanceAnim] = useState<boolean>(false);
    const toggleLanguage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setDropdownOpen((prevState) => !prevState);
    };

    useEffect(() => {
        setIsBalanceAnim(true);
        const timeOut = setTimeout(() => setIsBalanceAnim(false), 2000);

        return () => {
            clearTimeout(timeOut);
        };
    }, [props.balance]);

    return (
        <header className={Styles.header}>
            <div className="game-container d-flex">
                <Navbar expand="md" className={Styles["navbar-custom"]}>
                    <div className={Styles["header-container"]}>
                        <div className={Styles["user"]}>
                            <div className={Styles["avatar"]}>
                                {/* <img src={`/static/images/avatar/1.png`} className="img-fluid" alt="Avatar" /> */}
                                <span className={`icon-user ${Styles["icon-user"]}`}></span>
                            </div>
                            <div className={Styles["info"]}>
                                <div className={Styles["user-name"]}>{props.name}</div>
                                <div className={`${Styles.balance} ${isBalanceAnim ? Styles["balance-animation"] : ""}`}>
                                    {numberWithCommas(props.balance)} {props.currency}
                                </div>
                            </div>
                        </div>
                        <ButtonDropdown disabled isOpen={dropdownOpen} toggle={toggleLanguage} className={Styles["language"]}>
                            <DropdownToggle className={Styles["dropdown-toggle"]} caret>
                                <span className={`${toggleName[locale] === toggleName.vi ? Styles["flag-vn"] : Styles["flag-en"]}`}></span>
                                {toggleName[locale]}
                            </DropdownToggle>
                            <DropdownMenu right className={Styles["dropdown-menu"]}>
                                <DropdownItem className={Styles["dropdown-item"]}>
                                    <Link href="/" locale="vi">
                                        <div className={Styles["lang-item"]}>
                                            <span className={Styles["flag-vn"]}></span> VN
                                        </div>
                                    </Link>
                                </DropdownItem>
                                <DropdownItem className={Styles["dropdown-item"]}>
                                    <Link href="/" locale="en">
                                        <div className={Styles["lang-item"]}>
                                            <span className={Styles["flag-en"]}></span> EN
                                        </div>
                                    </Link>
                                </DropdownItem>
                            </DropdownMenu>
                        </ButtonDropdown>
                    </div>
                </Navbar>
            </div>
        </header>
    );
};

export default Header;
