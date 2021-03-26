import { useTranslation } from "next-i18next";
import React from "react";

import { GameState } from "../../../shared/game-base/type";
import RoundHistoryContainer from "../../../shared/round-history/container";
import RoundHistoryItem from "../../../shared/round-history/item";
import { StatisticItem } from "../../../shared/round-history/type";
import SeDieDot from "../dot";
import { DiceColor, Result, SettlementResult } from "./../sedie";
import { Props } from "./round-history";
import Styles from "./se-die-statistic.module.scss";

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
        result.class = "dot-red";
    } else {
        result.class = "dot-white";
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

// const getElementRound = (data: StatisticItem, col: number, row: number, roundId: number) => {
//     if (data.type) {
//         return (
//             <div
//                 key={roundId}
//                 className={DotStyles[data.type.class]}
//                 style={{
//                     gridColumnStart: col.toString(),
//                     gridRowStart: row.toString(),
//                 }}
//             >
//                 {data.type.count}
//             </div>
//         );
//     } else {
//         return <div></div>;
//     }
// };

const renderRoundDetail = (round: Round<Result, SettlementResult>) => {
    const { t } = useTranslation("xocxoc");
    const { roundId, settlementResult, result } = round;
    const totalDiceRed = 4;
    const countRed = countRedDot(result);

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

// const SeDieHistory = (props: Props) => {
//     const { roundHistory, gameState } = props;
//     const classNameDice = [Styles["mini-item-red"], Styles["mini-item-white"]];
//     return (
//         <div>
//             <MiniRoundHistory
//                 gameState={gameState}
//                 roundHistory={roundHistory}
//                 countItem={20}
//                 diceType={typeDiceResult}
//                 classNameDice={classNameDice}
//                 renderToolTipItem={renderRoundDetail}
//             ></MiniRoundHistory>
//             <SeDiceStatistic roundHistory={roundHistory}></SeDiceStatistic>
//             <RoundHistory
//                 roundHistory={roundHistory}
//                 gameState={gameState}
//                 getElementRound={getElementRound}
//                 getDataFromChild={getDataFromChild}
//             ></RoundHistory>
//         </div>
//     );
// };

const countRedDot = (result: Result) => Object.keys(result).reduce((total, key) => (result[key] ? total + 1 : total), 0);

const isEven = (numberOfRedDot: number) => numberOfRedDot % 2 > 0;

const SeDieRoundHistory = (props: Props) => {
    const { gameState, roundHistory } = props;
    const numberOfItems = gameState === GameState.LockingBet ? 19 : 20;

    return (
        <RoundHistoryContainer>
            {roundHistory.slice(0, numberOfItems).map((round, index) => (
                <RoundHistoryItem key={round.roundId} round={round} renderRoundDetail={renderRoundDetail}>
                    <SeDieDot red={isEven(countRedDot(round.result))} />
                </RoundHistoryItem>
            ))}
        </RoundHistoryContainer>
    );
};

export default SeDieRoundHistory;
