import React, { useState } from "react";
import Styles from "./se-die-statistic.module.scss";
import MiniStatistic from "../../shared/statistic/line";
import Statistic from "../../shared/statistic/scoreboard";
import { StatisticItem, MiniStatisticItem } from "../../shared/statistic/type";
import { Result, SettlementResult, DiceColor } from "./sedie";
import { ToolTip, ToolTipChild } from "../../shared/tool-tip";
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

const handleStatisticDiceMini = (result: Result, roundId: number, settlementResult: SettlementResult): MiniStatisticItem => {
    const resultHandle: MiniStatisticItem = {
        class: "item-red",
        count: 0,
        settlementResult: settlementResult,
        roundId: roundId,
        result: result,
    };
    let countType = 0;
    typeDiceResult.forEach((type) => {
        if (result[type]) {
            countType++;
        }
    });
    resultHandle.count = countType;

    if (countType % 2) {
        resultHandle.class = "mini-item-red";
    } else {
        resultHandle.class = "mini-item-white";
    }

    return resultHandle;
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

const convertDataStatistic = (settlementResult: SettlementResult, resultDices: Result, roundId: number) => {
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

const itemStatistic = (data: StatisticItem, col: number, row: number, roundId: number) => {
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

const ToolTipItem = (props) => {
    const { t } = useTranslation("xocxoc");
    const { roundId, settlementResult, count } = props.data;
    const totalDiceRed = 4;
    return (
        <div>
            <span className={Styles["tooltip-round"]}>#{roundId}</span>
            <div>
                <span className={Styles["tooltip-title"]}>{settlementResult.even ? t("even") : t("odd")}</span>
                <div className={Styles["tooltip-display"]}>
                    <span className={Styles["tooltip-dice-red"]}></span>
                    <span className={Styles["tooltip-number"]}>{count}</span>
                </div>
                <div className={Styles["tooltip-display"]}>
                    <span className={Styles["tooltip-dice-white"]}></span>
                    <span className={Styles["tooltip-number"]}>{totalDiceRed - count}</span>
                </div>
            </div>
        </div>
    );
};

const miniItemStatistic = (result: MiniStatisticItem) => {
    const [tooltipIsOpen, setIsTooltipOpen] = useState(false);
    const openToolTip = () => {
        setIsTooltipOpen(!tooltipIsOpen);
    };
    const closeToolTip = () => {
        setIsTooltipOpen(false);
    };
    return (
        <div key={result.roundId} className={`${Styles[result.class]}`} onClick={() => openToolTip()}>
            <ToolTip>
                {tooltipIsOpen && (
                    <ToolTipChild key={"tip" + result.roundId}>
                        <ToolTipItem data={result}></ToolTipItem>
                    </ToolTipChild>
                )}
            </ToolTip>
        </div>
    );
};

const SeDieStatistic = (props: Props) => {
    const { roundHistory, gameState } = props;
    const dataHeader = handleHeaderData(roundHistory, gameState);
    const resultPercentDice = handlePercent(dataHeader.resultDiceRed);
    return (
        <div>
            <MiniStatistic
                results={roundHistory}
                gameState={gameState}
                countItem={14}
                miniItemStatistic={miniItemStatistic}
                handleStatisticDiceMini={handleStatisticDiceMini}
            ></MiniStatistic>
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

            <Statistic
                results={roundHistory}
                gameState={gameState}
                itemStatistic={itemStatistic}
                convertDataStatistic={convertDataStatistic}
            ></Statistic>
        </div>
    );
};

export default SeDieStatistic;
