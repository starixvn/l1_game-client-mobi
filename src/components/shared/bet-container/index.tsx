import React, { useState } from "react";

import { BetContextProvider } from "../../../contexts/bet-context";
import { BetContextModel } from "../../../contexts/bet-context/type";
import { useGameActionContext } from "../../../contexts/game-actions-context";
import { useGameContext } from "../../../contexts/game-context/game-context";
import { GameState } from "../game-base/type";
import PlaceBetModal from "../place-bet-modal/place-bet-modal";
import { Props } from "./bet-container";
import Styles from "./bet-container.module.scss";

const BetContainer: React.FC<Props> = (props) => {
    return (
        <div className={Styles["bet-container"]}>
            {props.children}
            {GameState.LockingBet === props.gameState && <div className={Styles["overlay-mask"]}></div>}
        </div>
    );
};

export default BetContainer;
