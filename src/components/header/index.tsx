import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useCountUp } from "react-countup";
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
    const { countUp, update } = useCountUp({
        end: props.balance,
        decimals: 5,
    });
    const toggleName = { vi: "VN", en: "EN" };
    const router = useRouter();
    const { locale } = router;
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const toggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setDropdownOpen((prevState) => !prevState);
    };

    useEffect(() => {
        update(props.balance);
    }, [props.balance]);

    return (
        <header className={Styles.header}>
            <div className="game-container d-flex">
                <Navbar expand="md" className={Styles["navbar-custom"]}>
                    <div className={Styles["header-container"]}>
                        <div className={Styles["user-info"]}>
                            <div className={Styles["user-name"]}>
                                <span className={`icon-user ${Styles["icon-user"]}`}></span>
                                <span>{props.name}</span>
                            </div>
                            <div className={Styles.balance}>
                                {countUp ? numberWithCommas(+countUp) : 0} {props.currency}
                            </div>
                        </div>
                        <ButtonDropdown disabled isOpen={dropdownOpen} toggle={toggle} className={Styles["language"]}>
                            <DropdownToggle className={Styles["dropdown-toggle"]} caret>
                                <span className={`${toggleName[locale] == toggleName.vi ? Styles["flag-vn"] : Styles["flag-en"]}`}></span>
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
