import React, { useEffect, useState } from "react";
import { useCountUp } from "react-countup";
import { Navbar, ButtonDropdown, DropdownToggle, DropdownItem, DropdownMenu } from "reactstrap";
import Link from "next/link";
import { numberWithCommas } from "../../helpers/number-helper";
import { useRouter } from "next/router";
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
                        <ButtonDropdown isOpen={dropdownOpen} toggle={toggle} className={Styles["language"]}>
                            <DropdownToggle caret>{toggleName[locale]}</DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem className={Styles["dropdown-item"]}>
                                    <Link href="/" locale="vi">
                                        VN
                                    </Link>
                                </DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem className={Styles["dropdown-item"]}>
                                    <Link href="/" locale="en">
                                        EN
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
