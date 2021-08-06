import React, { useMemo } from "react";
import { ScoreboardItemNext } from "../../dot-next";
import { Round } from "../../../../../types";
import { Props } from "./types";
import { v4 as uuidV4 } from "uuid";
import { useGameContext } from "../../../../../contexts/game-context/game-context";
import Styles from "../round-history.module.scss";
import { GameBaseProps } from "../../../game-base/type";

const rowTotal = 7;
const conditionChangeDotDefault = (settlementResult: any) => {
    let value = 0;
    Object.keys(settlementResult).forEach((name, index) => {
        if (settlementResult[name]) {
            value = index;
        }
    });

    return value;
};

const getDotNextDetails = (col: number, row: number) => {
    return <ScoreboardItemNext key={uuidV4()} col={col} row={row}></ScoreboardItemNext>;
};

const drawDragonTailHistory = <R, S>(
    roundHistory: Round<R, S>[],
    isShowBlink: boolean,
    getDotDetails: Function,
    conditionChangeDot?: (settlementResult: any) => void,
    translateDotTextMapping?: object,
    gameSetting?: GameBaseProps
) => {
    let col = 1,
        row = 1;
    let nextCol = 1;
    let previousResult = undefined;
    const rowMax = {};
    let colMax = 0;
    const result = roundHistory.reduceRight((resultRound, round: Round<R, S>, index) => {
        const value = conditionChangeDot(round.settlementResult);
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
        resultRound[index] = getDotDetails({
            result: round.result,
            col: col,
            row: row,
            roundId: round.roundId,
            translateDotTextMapping: translateDotTextMapping,
            gameSetting: gameSetting,
            settlementResult: round.settlementResult,
        });

        return resultRound;
    }, []);

    isShowBlink && result.push(addDotNext(rowMax, row, col, nextCol, getDotNextDetails));
    return result;
};
const addDotNext = (rowMax: {}, row: number, col: number, nextCol: number, getDotNextDetails: Function) => {
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

    return getDotNextDetails(col, row);
};

const ScoreboardDragon = <R, S>(props: Props<R, S>) => {
    const { roundHistory, getDotDetails, translateDotTextMapping } = props;
    let { conditionChangeDot } = props;
    if (!conditionChangeDot) {
        conditionChangeDot = conditionChangeDotDefault;
    }
    const { isShowBlink, gameSetting } = useGameContext();

    return useMemo(() => {
        return (
            <div className={Styles["score-board-dragon-container"]}>
                {drawDragonTailHistory(roundHistory, isShowBlink, getDotDetails, conditionChangeDot, translateDotTextMapping, gameSetting)}
            </div>
        );
    }, [roundHistory, isShowBlink, getDotDetails, conditionChangeDot]);
};

export default ScoreboardDragon;
