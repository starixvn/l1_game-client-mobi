import React from "react";

import { GameState } from "../game-base/type";
import LockingBet from "../locking-bet";
import { Props } from "./bet-container";
import Styles from "./bet-container.module.scss";

const BetContainer: React.FC<Props> = (props) => {
    return (
        <div className={Styles["bet-container"]}>
            {props.children}
            {GameState.LockingBet === props.gameState && <LockingBet />}
        </div>
    );
};

export default BetContainer;
