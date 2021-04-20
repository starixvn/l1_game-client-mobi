import React from "react";
import Styles from "./statistic.module.scss";
import { historyData, Props } from "./statistic";

export function handlePercentData(data: number[], templateResult: number[]): number[] {
    const reducer = (accumulator: number, currentValue: number) => accumulator + currentValue;
    const totalDiceRed = data.reduce(reducer);
    let totalPercent = 0;
    data.forEach((diceTotal, index) => {
        const percent = Math.round((diceTotal / totalDiceRed) * 100);
        if (totalPercent + percent > 100) {
            templateResult[index] = 100 - totalPercent;
        } else if (totalPercent === 100) {
            templateResult[index] = 0;
        } else {
            templateResult[index] = percent;
        }

        totalPercent += percent;
    });

    return templateResult;
}

export function countHistorySettlement(historyData: historyData[], keyChoices: string[], templateResult: number[]) {
    historyData.forEach((history: any) => {
        const settlementResult = history.settlementResult;
        keyChoices.forEach((key, index) => {
            if (settlementResult[key]) {
                templateResult[index]++;
            }
        });
    });

    return templateResult;
}

export function countHistoryResultIsBoolean(historyData: historyData[], keyChoices: string[], templateResult: number[]): number[] {
    historyData.forEach((history) => {
        let countDice = 0;
        const result = history.result;
        keyChoices.forEach((key) => {
            if (result[key]) {
                countDice++;
            }
        });
        if (countDice > 0) {
            templateResult[countDice - 1]++;
        }
    });

    return templateResult;
}

export function countHistoryResultNotExistKey(historyData: historyData[]): number {
    let count = 0;
    historyData.forEach((history) => {
        const result = history.result;
        const keyResult = Object.keys(result);
        let allFalse = true;
        keyResult.forEach((key, index) => {
            if (result[key]) {
                allFalse = false;
            }
        });
        if (allFalse) {
            count++;
        }
    });

    return count;
}

export const countHistoryResultIsNumber = (historyData: historyData[], templateResult: number[]) => {
    historyData.forEach((history) => {
        const resultDices = history.result;
        const valueChoices = Object.values(resultDices);

        valueChoices.forEach((character: number, index: number) => {
            templateResult[character] = (templateResult[character] ?? 0) + 1;
        });
    });

    return templateResult;
};

export const WrapperHeader = (props: Props) => {
    return <div className={Styles["statistic-group"]}>{props.children}</div>;
};

export default WrapperHeader;
