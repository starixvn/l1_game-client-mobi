import React from "react";
import Styles from "./se-die-statistic.module.scss";
import { typeDiceResult } from "./se-die";

type Props = {
    results: any;
    gameState: number;
};

interface SeDieStatistic {
    statistic: {
        odd: number;
        even: number;
    };
    resultDiceRed: resultDiceRed[];
}

enum resultDiceRed {
    dice1,
    dice2,
    dice3,
    dice4,
}

const handleData = (data: any, gameState): SeDieStatistic => {
    const result: SeDieStatistic = {
        statistic: {
            odd: 0,
            even: 0,
        },
        resultDiceRed: [0, 0, 0, 0],
    };
    data.forEach((history: any) => {
        const settlementResult = history.settlementResult;
        const resultDices = history.result;
        if (settlementResult.even) {
            result.statistic.even++;
        }

        if (settlementResult.odd) {
            result.statistic.odd++;
        }

        typeDiceResult.forEach((name, index) => {
            if (resultDices[name]) {
                result.resultDiceRed[index]++;
            }
        });
    });

    return result;
};
const SeDieStatistic = (props: Props) => {
    const { results, gameState } = props;
    const data = handleData(results, gameState);
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    const totalDiceRed = data.resultDiceRed.reduce(reducer);
    return (
        <div className={Styles["statistic-header"]}>
            <div className={Styles["wrapper-header"]}>
                <span className={Styles["titleOdd"]}> Odd</span>
                <span className={Styles["number"]}>{data.statistic.odd}%</span>
            </div>
            <div className={Styles["wrapper-header"]}>
                <span className={Styles["titleEven"]}> Even</span>
                <span className={Styles["number"]}>{data.statistic.even}%</span>
            </div>

            <div className={Styles["wrapper-header"]}>
                <span className={Styles["title-red"]}> 1</span>
                <span className={Styles["number"]}>{Math.round((data.resultDiceRed[0] / totalDiceRed) * 100)}%</span>
            </div>
            <div className={Styles["wrapper-header"]}>
                <span className={Styles["title-white"]}> 2</span>
                <span className={Styles["number"]}>{Math.round((data.resultDiceRed[1] / totalDiceRed) * 100)}%</span>
            </div>
            <div className={Styles["wrapper-header"]}>
                <span className={Styles["title-red"]}> 3</span>
                <span className={Styles["number"]}>{Math.round((data.resultDiceRed[2] / totalDiceRed) * 100)}%</span>
            </div>
            <div className={Styles["wrapper-header"]}>
                <span className={Styles["title-white"]}> 4</span>
                <span className={Styles["number"]}>{Math.round((data.resultDiceRed[3] / totalDiceRed) * 100)}%</span>
            </div>
        </div>
    );
};

export default SeDieStatistic;
