import React from "react";
import Styles from "./se-die-statistic.module.scss";
import RoundHistory from "../../../shared/round-history/scoreboard";
import MiniRoundHistory from "../../../shared/round-history/line";
import { StatisticItem } from "../../../shared/round-history/type";
import { Result, SettlementResult, DiceColor } from "./../sedie";
import { useTranslation } from "next-i18next";
import { Props } from "./round-history";
import SeDiceStatistic from "../statistic";

export const typeDiceResult = ["red1", "red2", "red3", "red4"];
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

const SeDieHistory = (props: Props) => {
    const { roundHistory, gameState } = props;
    const classNameDice = [Styles["mini-item-red"], Styles["mini-item-white"]];
    return (
        <div>
            <MiniRoundHistory
                gameState={gameState}
                roundHistory={roundHistory}
                countItem={20}
                diceType={typeDiceResult}
                classNameDice={classNameDice}
                renderToolTipItem={renderToolTipItem}
            ></MiniRoundHistory>
            <SeDiceStatistic roundHistory={roundHistory}></SeDiceStatistic>
            <RoundHistory
                roundHistory={roundHistory}
                gameState={gameState}
                getElementRound={getElementRound}
                getDataFromChild={getDataFromChild}
            ></RoundHistory>
        </div>
    );
};

export default SeDieHistory;
