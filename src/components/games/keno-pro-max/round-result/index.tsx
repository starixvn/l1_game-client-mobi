import { useTranslation } from "next-i18next";
import React from "react";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import { Result, SettlementResult } from "../keno-pro-max";
import { GetChoiceTranslate, getTotalPoint, getLabelFromFiveElements } from "../keno-pro-max-helper";
import BallNumber from "../../../keno/ball-number";
import { GameState } from "../../../shared/game-base/type";
import Styles from "./round-result.module.scss";

export const generateResult = (result: Result, isAnimation: boolean) => {
    return result.map((number: number, index: number) => (
        <BallNumber key={index} value={number} hasAnimation={isAnimation} classCustomize={"keno-pro-max"} />
    ));
};

export const winningInfo: React.FC<{ settlementResult: SettlementResult; textTranslate }> = ({ settlementResult, textTranslate }) => {
    const isBig = settlementResult?.big ? true : false;
    const isEven = settlementResult?.even ? true : false;
    const element = getLabelFromFiveElements(settlementResult);
    return (
        <div className={Styles["winning-info"]}>
            <div className={Styles[`result-info-${isBig ? "blue" : "red"}`]}>{isBig ? textTranslate.big : textTranslate.small}</div>
            <div className={Styles[`result-info-${isEven ? "blue" : "red"}`]}>{isEven ? textTranslate.even : textTranslate.odd}</div>
            <div className={Styles["result-info-grey"]}>{textTranslate[element]}</div>
        </div>
    );
};

export const renderTotalPoint: React.FC<{ result: Result; textTranslate; customizeClass?: string }> = ({
    result,
    textTranslate,
    customizeClass,
}) => {
    const total = getTotalPoint(result);
    return (
        <div className={`${Styles["result-total"]} ${customizeClass}`}>
            <div className={Styles["result-total-lbl"]}>{textTranslate.total} </div>
            <div className={Styles["result-total-number"]}>{total}</div>
        </div>
    );
};

export const RoundResult: React.FC<{
    result?: Result;
    settlementResult: SettlementResult;
    gameState: GameState;
}> = ({ result, settlementResult, gameState }) => {
    const { playResultAnimation, gameSetting } = useGameContext();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());
    const textTranslate = GetChoiceTranslate(t);
    const isAnimation = gameState === GameState.DisplayResult && playResultAnimation;
    return (
        <div className={`${Styles["round-result"]} ${isAnimation ? Styles["has-animation"] : ""}`}>
            <div className={Styles["result"]}>
                <div className={Styles["number-container"]}>{result && generateResult(result, playResultAnimation)}</div>
            </div>
            <div className={Styles["settle-info"]}>
                {renderTotalPoint({ result, textTranslate })}
                {gameState !== GameState.LockingBet && winningInfo({ settlementResult, textTranslate })}
            </div>
        </div>
    );
};

export const RoundResultCollapse: React.FC<{ result: Result; settlementResult: SettlementResult; gameState: GameState }> = ({
    result,
    settlementResult,
    gameState,
}) => {
    const { playResultAnimation, gameSetting } = useGameContext();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());
    const total = getTotalPoint(result);
    const isAnimation = gameState === GameState.DisplayResult && playResultAnimation;

    return (
        <div className={`${Styles["result-collapse-mode"]}  ${isAnimation ? Styles["has-animation"] : ""}`}>
            <div className={Styles["result-container-collapse"]}>{generateResult(result, isAnimation)}</div>
            {!isAnimation && settlementResult && (
                <div className={Styles["result-label"]}>
                    <span className={Styles["total-point"]}>{total}</span>-{` ${t(settlementResult?.big ? "big" : "small")}`}
                </div>
            )}
        </div>
    );
};
