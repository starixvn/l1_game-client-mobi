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
    }, [props.balance]);

    useEffect(() => {
        const timeOut = setTimeout(() => setIsBalanceAnim(false), 500);
        return () => {
            clearTimeout(timeOut);
        };
    }, [isBalanceAnim]);

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
                {/* <div className={Styles["dices-none"]}>
                    <img src={`static/images/dices/dice_01.png`} alt="dice" />
                    <img src={`static/images/dices/dice_02.png`} alt="dice" />
                    <img src={`static/images/dices/dice_03.png`} alt="dice" />
                    <img src={`static/images/dices/dice_04.png`} alt="dice" />
                    <img src={`static/images/dices/dice_05.png`} alt="dice" />
                    <img src={`static/images/dices/dice_06.png`} alt="dice" />
                    <img src={`static/images/dices/dice_07.png`} alt="dice" />
                    <img src={`static/images/dices/dice_08.png`} alt="dice" />
                    <img src={`static/images/dices/dice_09.png`} alt="dice" />
                    <img src={`static/images/dices/dice_10.png`} alt="dice" />
                    <img src={`static/images/dices/dice_11.png`} alt="dice" />
                    <img src={`static/images/dices/dice_12.png`} alt="dice" />
                    <img src={`static/images/dices/dice_13.png`} alt="dice" />
                    <img src={`static/images/dices/dice_14.png`} alt="dice" />
                    <img src={`static/images/dices/dice_15.png`} alt="dice" />
                    <img src={`static/images/dices/dice_16.png`} alt="dice" />
                    <img src={`static/images/dices/dice_17.png`} alt="dice" />
                    <img src={`static/images/dices/dice_18.png`} alt="dice" />
                    <img src={`static/images/dices/dice_19.png`} alt="dice" />
                    <img src={`static/images/dices/dice_20.png`} alt="dice" />
                    <img src={`static/images/dices/dice_21.png`} alt="dice" />
                    <img src={`static/images/dices/dice_22.png`} alt="dice" />
                    <img src={`static/images/dices/dice_23.png`} alt="dice" />
                    <img src={`static/images/dices/dice_24.png`} alt="dice" />
                    <img src={`static/images/dices/dice_25.png`} alt="dice" />
                    <img src={`static/images/dices/dice_26.png`} alt="dice" />
                    <img src={`static/images/dices/dice_27.png`} alt="dice" />
                    <img src={`static/images/dices/dice_28.png`} alt="dice" />
                    <img src={`static/images/dices/dice_29.png`} alt="dice" />
                    <img src={`static/images/dices/dice_30.png`} alt="dice" />
                </div> */}
            </div>
        </header>
    );
};

export default Header;
