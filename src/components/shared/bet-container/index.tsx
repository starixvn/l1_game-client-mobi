import React, { useEffect, useState } from "react";

import { GameState } from "../game-base/type";
import LockingBet from "../locking-bet";
import { Props } from "./bet-container";
import Styles from "./bet-container.module.scss";

const BetContainer: React.FC<Props> = (props) => {
    const [customStyle, setCustomStyle] = useState<object>();

    useEffect(() => {
        setCustomStyle(props.gameState !== GameState.InRound ? { cursor: "not-allowed" } : { cursor: "pointer" });
    }, [props.gameState]);

    return (
        <div className={Styles["bet-container"]} style={customStyle}>
            {props.children}
            {GameState.LockingBet === props.gameState && <LockingBet />}
        </div>
    );
};

export default BetContainer;
