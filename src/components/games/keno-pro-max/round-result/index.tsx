import { useTranslation } from "next-i18next";
import React, { useEffect, useState, useMemo } from "react";

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

export const winningInfo: React.FC<{ settlementResult: SettlementResult; textTranslate; customizeClass?: string }> = ({
    settlementResult,
    textTranslate,
    customizeClass,
}) => {
    const isBig = settlementResult?.big ? true : false;
    const isEven = settlementResult?.even ? true : false;
    const element = getLabelFromFiveElements(settlementResult);

    return (
        <div className={`${Styles["winning-info"]} ${Styles[customizeClass]}`}>
            <div className={Styles[`result-info-${isBig ? "blue" : "red"}`]}>{isBig ? textTranslate.big : textTranslate.small}</div>
            <div className={Styles[`result-info-${isEven ? "blue" : "red"}`]}>{isEven ? textTranslate.even : textTranslate.odd}</div>
            <div className={Styles["result-info-grey"]}>{textTranslate[element]}</div>
        </div>
    );
};

let interval: NodeJS.Timer = null;
export const RenderTotalPoint: React.FC<{ result: Result; textTranslate; customizeClass?: string; isAnimation?: boolean }> = ({
    result,
    textTranslate,
    customizeClass,
    isAnimation,
}) => {
    const [total, setTotal] = useState<number>(0);
    useEffect(() => {
        if (isAnimation) {
            let currentTotal = 0;
            let index = 0;
            interval = setInterval(() => {
                if (index === result.length) {
                    clearInterval(interval);
                } else {
                    currentTotal += result[index];
                    setTotal(currentTotal);
                    index++;
                }
            }, 100);
        } else {
            result && setTotal(getTotalPoint(result));
        }

        return () => {
            interval && clearInterval(interval);
        };
    }, [result, isAnimation]);
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
    showResultInfo: boolean;
}> = ({ result, settlementResult, gameState, showResultInfo }) => {
    const { playResultAnimation, gameSetting } = useGameContext();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());
    const textTranslate = GetChoiceTranslate(t);

    return useMemo(() => {
        const isAnimation = gameState === GameState.DisplayResult && playResultAnimation;
        const classWinningInfoHide = gameState === GameState.LockingBet ? "hide" : "show";

        return (
            <div className={`${Styles["round-result"]} ${isAnimation ? Styles["has-animation"] : ""}`}>
                <div className={Styles["result"]}>
                    <div className={Styles["number-container"]}>{result && generateResult(result, isAnimation)}</div>
                </div>
                <div className={`${Styles["settle-info"]} ${showResultInfo ? Styles["settle-info-show"] : ""}`}>
                    <RenderTotalPoint result={result} textTranslate={textTranslate} isAnimation={isAnimation} />
                    {winningInfo({ settlementResult, textTranslate, customizeClass: classWinningInfoHide })}
                </div>
            </div>
        );
    }, [result, settlementResult, gameState, showResultInfo, playResultAnimation]);
};

export const RoundResultCollapse: React.FC<{
    result: Result;
    settlementResult: SettlementResult;
    gameState: GameState;
    showResultInfo: boolean;
}> = ({ result, settlementResult, gameState, showResultInfo }) => {
    const { playResultAnimation, gameSetting } = useGameContext();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());
    const total = getTotalPoint(result);

    return useMemo(() => {
        const isAnimation = gameState === GameState.DisplayResult && playResultAnimation;

        return (
            <div className={`${Styles["result-collapse-mode"]}  ${isAnimation ? Styles["has-animation"] : ""}`}>
                <div className={Styles["result-container-collapse"]}>{generateResult(result, isAnimation)}</div>
                {!isAnimation && showResultInfo && (
                    <div className={Styles["result-label"]}>
                        <span className={Styles["total-point"]}>{total}</span>-{` ${t(settlementResult?.big ? "big" : "small")}`}
                    </div>
                )}
            </div>
        );
    }, [result, settlementResult, gameState, showResultInfo, playResultAnimation]);
};
