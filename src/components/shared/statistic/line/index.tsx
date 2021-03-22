import React from "react";

import { RoundHistory, Result, SettlementResult } from "../../../games/se-die/sedie";
import styles from "../statistic.module.scss";
import MiniItem from "./mini-item";
import { MiniItemType } from "../type";
import { GameState } from "../../game-base/type";
import MiniItemNext from "./mini-item-next";

type Props = {
    results: RoundHistory[];
    gameState: number;
    countItem: number;
    typeDiceResult: string[];
};

const typeDice = ["red1", "red2", "red3", "red4"];

function handleColorDice(result: Result, roundId: number, settlementResult: SettlementResult): MiniItemType {
    const resultHandle: MiniItemType = {
        class: "item-red",
        count: 0,
        settlementResult: settlementResult,
        roundId: roundId,
    };
    let countType = 0;
    typeDice.forEach((type) => {
        if (result[type]) {
            countType++;
        }
    });
    resultHandle.count = countType;

    if (countType % 2) {
        resultHandle.class = "item-red";
    } else {
        resultHandle.class = "item-white";
    }

    return resultHandle;
}

function filterData(data: RoundHistory[]): MiniItemType[] {
    return data.map((element) => {
        return handleColorDice(element.result, element.roundId, element.settlementResult);
    });
}

function handleData(result: RoundHistory[], countItem: number, gameState: number) {
    const dataFilter = filterData(result.slice(0, countItem));
    const data = [...dataFilter].reverse();
    let finalData = data.map((item) => {
        return <MiniItem key={item.roundId} result={item}></MiniItem>;
    });

    if (gameState === GameState.LockingBet) {
        finalData.unshift(<MiniItemNext></MiniItemNext>);
        finalData.pop();
    } else {
        return finalData;
    }
}

export default function MiniStatistic(props: Props) {
    const { results, gameState, countItem } = props;

    return (
        <div className={styles["mini-statistic-container"]}>
            <div className={styles["line-container"]}>{handleData(results, countItem, gameState)}</div>
        </div>
    );
}
