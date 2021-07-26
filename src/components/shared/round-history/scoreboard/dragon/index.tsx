import React, { useMemo } from "react";
import { ScoreboardItemNext } from "../../dot-next";
import { Round } from "../../../../../types";
import { Props } from "./types";
import { v4 as uuidV4 } from "uuid";
import { useGameContext } from "../../../../../contexts/game-context/game-context";
import Styles from "../round-history.module.scss";
import { GameBaseProps } from "../../../game-base/type";

const rowTotal = 7;
const checkConditionBase = (settlementResult: any) => {
    let value = 0;
    Object.keys(settlementResult).forEach((name, index) => {
        if (settlementResult[name]) {
            value = index;
        }
    });

    return value;
};

const roundNext = (col: number, row: number) => {
    return <ScoreboardItemNext key={uuidV4()} col={col} row={row}></ScoreboardItemNext>;
};

const drawDragonTailHistory = <R, S>(
    roundHistory: Round<R, S>[],
    isShowBlink: boolean,
    getElementRound: (
        result: any,
        col: number,
        row: number,
        roundId: number,
        translateDotTextMapping?: object,
        gameSetting?: GameBaseProps,
        settlementResult?: any
    ) => void,
    checkCondition?: (settlementResult: any) => void,
    translateDotTextMapping?: object,
    gameSetting?: GameBaseProps
) => {
    let col = 1,
        row = 1;
    let nextCol = 1;
    let previousResult = undefined;
    const rowMax = {};
    let colMax = 0;
    const result = roundHistory.map((round: Round<R, S>) => {
        const value = checkCondition(round.settlementResult);
        if (value === previousResult) {
            const max = rowMax.hasOwnProperty(col) ? rowMax[col] : rowTotal;

            if (row < max - 1) {
                row++;
            } else if (row === 0 && max === 1) {
                col = nextCol;
                nextCol++;
            } else {
                col++;
                rowMax[col] = row;
            }
        } else {
            row = 1;
            col = nextCol;
            nextCol++;
        }

        if (col > colMax) {
            colMax = col;
        }
        previousResult = value;

        return getElementRound(round.result, col, row, round.roundId, translateDotTextMapping, gameSetting, round.settlementResult);
    });

    isShowBlink && result.push(addNextElement(rowMax, row, col, nextCol, roundNext));
    return result;
};
const addNextElement = (rowMax: {}, row: number, col: number, nextCol: number, roundNext: Function) => {
    const max = rowMax.hasOwnProperty(col) ? rowMax[col] : rowTotal;
    if (row < max - 1) {
        row++;
    } else {
        row = 0;
        col = nextCol;
    }

    if (row === 1 && col === 0) {
        col = 1;
        row = 0;
    }

    return roundNext(col, row);
};

const ScoreboardDragon = <R, S>(props: Props<R, S>) => {
    const { roundHistory, getElementRound, translateDotTextMapping } = props;
    let { checkCondition } = props;
    if (!checkCondition) {
        checkCondition = checkConditionBase;
    }
    const { isShowBlink, gameSetting } = useGameContext();

    return useMemo(() => {
        return (
            <div className={Styles["score-board-dragon-container"]}>
                {drawDragonTailHistory(
                    [...roundHistory].reverse(),
                    isShowBlink,
                    getElementRound,
                    checkCondition,
                    translateDotTextMapping,
                    gameSetting
                )}
            </div>
        );
    }, [roundHistory, isShowBlink, getElementRound, checkCondition, gameSetting, translateDotTextMapping]);
};

export default ScoreboardDragon;
