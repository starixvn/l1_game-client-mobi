import React from "react";
import Styles from "./se-die-statistic.module.scss";
import RoundHistory from "../../shared/round-history/scoreboard";
import MiniRoundHistory from "../../shared/round-history/line";
import { StatisticItem } from "../../shared/round-history/type";
import { Result, SettlementResult, DiceColor } from "./sedie";
// import MiniRound from "./mini-round-history";
import { useTranslation } from "next-i18next";

export const typeDiceResult = ["red1", "red2", "red3", "red4"];

type Props = {
    roundHistory: any;
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
    red1,
    red2,
    red3,
    red4,
    white,
}

const handleHeaderData = (data: any, gameState): SeDieStatistic => {
    const result: SeDieStatistic = {
        statistic: {
            odd: 0,
            even: 0,
        },
        resultDiceRed: [0, 0, 0, 0, 0],
    };
    data.forEach((history: any) => {
        const settlementResult = history.settlementResult;
        const resultDices = history.result;
        let countDiceRed = 0;
        if (settlementResult.even) {
            result.statistic.even++;
        }

        if (settlementResult.odd) {
            result.statistic.odd++;
        }

        typeDiceResult.forEach((name, index) => {
            if (resultDices[name]) {
                countDiceRed++;
            }
        });

        switch (countDiceRed) {
            case 1:
                result.resultDiceRed[0]++;
                break;
            case 2:
                result.resultDiceRed[1]++;
                break;
            case 3:
                result.resultDiceRed[2]++;
                break;
            case 4:
                result.resultDiceRed[3]++;
                break;
            default:
                result.resultDiceRed[4]++;
                break;
        }
    });

    return result;
};

const handlePercent = (data: resultDiceRed[]): resultDiceRed[] => {
    const result: resultDiceRed[] = [0, 0, 0, 0, 0];
    const reducer = (accumulator: number, currentValue: number) => accumulator + currentValue;
    const totalDiceRed = data.reduce(reducer);
    let totalPercent = 0;
    data.forEach((diceTotal, index) => {
        const percent = Math.round((diceTotal / totalDiceRed) * 100);
        if (totalPercent + percent > 100) {
            result[index] = 100 - totalPercent;
        } else if (totalPercent === 100) {
            result[index] = 0;
        } else {
            result[index] = percent;
        }

        totalPercent += percent;
    });

    return result;
};

const handleColorDice = (data: Result): DiceColor => {
    const result: DiceColor = {
        class: "item-red",
        count: 0,
    };
    let countType = 0;
    typeDiceResult.forEach((type) => {
        if (data[type]) {
            countType++;
        }
    });
    result.count = countType;

    if (countType % 2) {
        result.class = "item-red";
    } else {
        result.class = "item-white";
    }

    return result;
};

const getDataFromChild = (settlementResult: SettlementResult, resultDices: Result, roundId: number) => {
    const tmpData: StatisticItem = {
        type: {
            class: "",
            count: 0,
        },
        value: 0,
        roundId: 0,
    };
    if (settlementResult.even) {
        tmpData.value = 0;
    }

    if (settlementResult.odd) {
        tmpData.value = 1;
    }

    tmpData.type = handleColorDice(resultDices);
    tmpData.roundId = roundId;

    return tmpData;
};

const getElementRound = (data: StatisticItem, col: number, row: number, roundId: number) => {
    if (data.type) {
        return (
            <div
                key={roundId}
                className={Styles[data.type.class]}
                style={{
                    gridColumnStart: col.toString(),
                    gridRowStart: row.toString(),
                }}
            >
                {data.type.count}
            </div>
        );
    } else {
        return <div></div>;
    }
};

const renderToolTipItem = (props: any) => {
    const { t } = useTranslation("xocxoc");
    const { roundId, settlementResult, result } = props;
    const totalDiceRed = 4;
    const countDiceRed = (result, typeDiceResult) => {
        let countType = 0;
        typeDiceResult.forEach((type) => {
            if (result[type]) {
                countType++;
            }
        });

        return countType;
    };
    const countRed = countDiceRed(result, typeDiceResult);

    return (
        <div>
            <span className={Styles["tooltip-round"]}>#{roundId}</span>
            <div>
                <span className={Styles["tooltip-title"]}>{settlementResult.even ? t("even") : t("odd")}</span>
                <div className={Styles["tooltip-display"]}>
                    <span className={Styles["tooltip-dice-red"]}></span>
                    <span className={Styles["tooltip-number"]}>{countRed}</span>
                </div>
                <div className={Styles["tooltip-display"]}>
                    <span className={Styles["tooltip-dice-white"]}></span>
                    <span className={Styles["tooltip-number"]}>{totalDiceRed - countRed}</span>
                </div>
            </div>
        </div>
    );
};

const SeDieStatistic = (props: Props) => {
    const { roundHistory, gameState } = props;
    const dataHeader = handleHeaderData(roundHistory, gameState);
    const resultPercentDice = handlePercent(dataHeader.resultDiceRed);
    const classNameDice = [Styles["mini-item-red"], Styles["mini-item-white"]];
    return (
        <div>
            <MiniRoundHistory
                gameState={gameState}
                roundHistory={roundHistory}
                countItem={30}
                diceType={typeDiceResult}
                classNameDice={classNameDice}
                renderToolTipItem={renderToolTipItem}
            ></MiniRoundHistory>
            <div className={Styles["statistic-header"]}>
                <div className={Styles["wrapper-header"]}>
                    <span className={Styles["titleOdd"]}> Odd</span>
                    <span className={Styles["number"]}>{dataHeader.statistic.odd}%</span>
                </div>
                <div className={Styles["wrapper-header"]}>
                    <span className={Styles["titleEven"]}> Even</span>
                    <span className={Styles["number"]}>{dataHeader.statistic.even}%</span>
                </div>

                <div className={Styles["percent-right"]}>
                    <div className={Styles["wrapper-header"]}>
                        <span className={Styles["title-white"]}> 0</span>
                        <span className={Styles["number"]}>{resultPercentDice[4]}%</span>
                    </div>

                    <div className={Styles["wrapper-header"]}>
                        <span className={Styles["title-red"]}> 1</span>
                        <span className={Styles["number"]}>{resultPercentDice[0]}%</span>
                    </div>
                    <div className={Styles["wrapper-header"]}>
                        <span className={Styles["title-white"]}> 2</span>
                        <span className={Styles["number"]}>{resultPercentDice[1]}%</span>
                    </div>
                    <div className={Styles["wrapper-header"]}>
                        <span className={Styles["title-red"]}> 3</span>
                        <span className={Styles["number"]}>{resultPercentDice[2]}%</span>
                    </div>
                    <div className={Styles["wrapper-header"]}>
                        <span className={Styles["title-white"]}> 4</span>
                        <span className={Styles["number"]}>{resultPercentDice[3]}%</span>
                    </div>
                </div>
            </div>

            <RoundHistory
                roundHistory={roundHistory}
                gameState={gameState}
                getElementRound={getElementRound}
                getDataFromChild={getDataFromChild}
            ></RoundHistory>
        </div>
    );
};

export default SeDieStatistic;
