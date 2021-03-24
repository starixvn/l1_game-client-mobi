import React, { useState } from "react";

import { RoundHistory } from "../../../games/se-die/sedie";
import styles from "../statistic.module.scss";
import { MiniStatisticItem } from "../type";
import { GameState } from "../../game-base/type";
import MiniItemNext from "./mini-item-next";
import { Tooltip } from "reactstrap";

type Props = {
    results: RoundHistory[];
    gameState: number;
    countItem: number;
    miniItemStatistic: (result: MiniStatisticItem) => {};
    handleStatisticDiceMini: (result: any, roundId: number, settlementResult: any) => {};
};


export default function MiniStatistic(props: Props) {
    const { results, gameState, countItem, miniItemStatistic, handleStatisticDiceMini } = props;
    const handleData = (result: RoundHistory[], countItem: number, gameState: number) => {
        const dataFilter = filterData(result.slice(0, countItem));
        const data = [...dataFilter].reverse();
        let finalData = data.map((item: MiniStatisticItem) => {
            return miniItemStatistic(item);
        });

        if (gameState === GameState.LockingBet) {
            finalData.unshift(<MiniItemNext></MiniItemNext>);
            finalData.pop();
        } else {
            return finalData;
        }
    };

    const filterData = (data: RoundHistory[]): MiniStatisticItem[] => {
        return data.map((element) => {
            return handleStatisticDiceMini(element.result, element.roundId, element.settlementResult) as MiniStatisticItem;
        });
    };

    return (
        <div className={styles["mini-statistic-container"]}>
            <div className={styles["line-container"]}>{handleData(results, countItem, gameState)}</div>
            {/* <div className={styles["tooltip"]}>
                Hover over me
                <div className={styles["tooltiptext"]}>
                    <span className={styles["tooltip-round"]}>#123123123</span>
                    <div>
                        <span className={styles["tooltip-title"]}>CHẴN</span>
                        <div className={styles["tooltip-display"]}>
                            <span className={styles["tooltip-dice-red"]}></span>
                            <span className={styles["tooltip-number"]}>3</span>
                        </div>
                        <div className={styles["tooltip-display"]}>
                            <span className={styles["tooltip-dice-white"]}></span>
                            <span className={styles["tooltip-number"]}>3</span>
                        </div>
                    </div>
                </div>
            </div> */}
        </div>
    );
}
