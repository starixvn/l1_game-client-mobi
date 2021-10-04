import { useTranslation } from "next-i18next";
import React from "react";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import { Result, SettlementResult } from "../keno-pro-max";
import { GetChoiceTranslate } from "../keno-pro-max-helper";
import BallNumber from "../../../keno/ball-number";
import Styles from "./keno-pro-max-animations.module.scss";
import { GameState } from "../../../shared/game-base/type";

const elements = ["gold", "wood", "water", "fire", "earth"];
const getTotalPoint = (result) => {
    return result ? result.reduce((a, b) => a + b, 0) : 0;
};

export const generateResult = (result: Result, isAnimation: boolean) => {
    return result.map((number: number, index: number) => (
        <BallNumber key={index} value={number} hasAnimation={isAnimation} classCustomize={"keno-pro-max"} />
    ));
};

const AnimationComponent = ({ settlementResult, playResultAnimation, result, textTranSlate, gameState }) => {
    const total = getTotalPoint(result);
    const element = settlementResult && elements.filter((e) => settlementResult[e])[0];

    return (
        <div className={`${Styles["animation-container"]}`}>
            <div className={Styles["result"]}>
                <div className={Styles["number-container"]}>{result && generateResult(result, playResultAnimation)}</div>
            </div>
            <div className={Styles["settle-info"]}>
                <div className={Styles["result-total"]}>
                    <div className={Styles["result-total-lbl"]}>{textTranSlate.total} </div>
                    <div className={Styles["result-total-number"]}>{total}</div>
                </div>
                {gameState !== GameState.LockingBet && (
                    <div className={Styles["winning-info"]}>
                        <div className={Styles[`result-info-${settlementResult?.big ? "blue" : "red"}`]}>
                            {settlementResult?.big ? textTranSlate.big : textTranSlate.small}
                        </div>
                        <div className={Styles[`result-info-${settlementResult?.even ? "blue" : "red"}`]}>
                            {settlementResult?.even ? textTranSlate.even : textTranSlate.odd}
                        </div>
                        <div className={Styles["result-info-grey"]}>{textTranSlate[element]}</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export const KenoProMaxResult: React.FC<{ result?: Result; settlementResult: SettlementResult; gameState: GameState }> = ({
    result,
    settlementResult,
    gameState,
}) => {
    const { playResultAnimation, gameSetting } = useGameContext();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());
    const textTranSlate = GetChoiceTranslate(t);
    return (
        <div className={`${playResultAnimation ? Styles["has-animation"] : ""}`}>
            <AnimationComponent
                settlementResult={settlementResult}
                playResultAnimation={playResultAnimation}
                result={result}
                textTranSlate={textTranSlate}
                gameState={gameState}
            />
        </div>
    );
};

export const KenoProMaxResultCollapse: React.FC<{ result: Result; settlementResult: SettlementResult }> = ({
    result,
    settlementResult,
}) => {
    const { playResultAnimation, gameSetting } = useGameContext();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());
    const total = getTotalPoint(result);

    return (
        <div className={`${Styles["result-collapse-mode"]}  ${playResultAnimation ? Styles["has-animation"] : ""}`}>
            <div className={Styles["result-container-collapse"]}>{generateResult(result, playResultAnimation)}</div>
            {!playResultAnimation && settlementResult && (
                <div className={Styles["result-label"]}>
                    <span className={Styles["total-point"]}>{total}</span>-{` ${t(settlementResult?.big ? "big" : "small")}`}
                </div>
            )}
        </div>
    );
};
