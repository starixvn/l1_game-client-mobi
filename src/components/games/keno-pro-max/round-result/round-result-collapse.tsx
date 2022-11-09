import { useTranslation } from "next-i18next";
import React from "react";
import { ResultClassState } from ".";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import BallNumber from "../../../keno/ball-number";
import { GameState } from "../../../shared/game-base/type";
import { Result, SettlementResult } from "../keno-pro-max";
import { getTotalPoint } from "../keno-pro-max-helper";
import Styles from "./keno-promax-animations.module.scss";

export const generateResultCollapse = (result: Result, isAnimation: boolean, mode: ResultClassState) => {    
    const ball = result.length; 
    const classResultMapping = {
        [ResultClassState.result]: "keno-pro-max",
        [ResultClassState.collapse]: `mega-keno-collapse_${ball}`,
        [ResultClassState.betHistory]: "keno-pro-max-bet-history",
    };        

    return result.map((number: number, index: number) => (
        <BallNumber key={index} value={number} hasAnimation={isAnimation} classCustomize={classResultMapping[mode]} />
    ));
};

export const KenoProMaxRoundResultCollapse: React.FC<{
    result: Result;
    settlementResult: SettlementResult;
    gameState: GameState;
}> = ({ result, settlementResult, gameState }) => {
    const { playResultAnimation, gameSetting } = useGameContext();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());
    const total = getTotalPoint(result);
    const isAnimation = gameState === GameState.DisplayResult && playResultAnimation;
    const rows = result.length / 5;   

    return (
        <div className={`${Styles["result-collapse-mode"]}  ${isAnimation ? Styles["has-animation"] : ""}`}>
            <div className={`${Styles["result-container-collapse"]} ${isAnimation ? Styles["has-animation"] : ""} ${Styles["rows-" + rows]}`}>
                {generateResultCollapse(result, isAnimation, ResultClassState.collapse)}
            </div>           

            <div className={`${Styles["result-label"]} ${isAnimation ? Styles["has-animation"] : ""} ${Styles["rows-" + rows]}`}>
                <span className={Styles["total-point"]}>{total}</span>-{` ${t(settlementResult?.big ? "big" : "small")}`}
            </div>
        </div>
    );
};
