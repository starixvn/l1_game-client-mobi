import { useTranslation } from "next-i18next";
import React from "react";
import { useGameContext } from "../../../../contexts/game-context/game-context";
import { Result, SettlementResult } from "../keno-pro-max";
import Styles from "./keno-pro-max-animations.module.scss";
import * as _ from "lodash";

export const getSettleResult = (result) => {
    const total = result.reduce((a, b) => a + b, 0);
    var settle: any = {
        total,
    };

    if (total > 810) {
        settle.big = true;
    } else {
        settle.small = true;
    }

    if (total % 2 === 1) {
        settle.odd = true;
    } else {
        settle.even = true;
    }

    if (total < 696) {
        settle.element = "gold";
    } else if (total < 764) {
        settle.element = "wood";
    } else if (total < 856) {
        settle.element = "water";
    } else if (total < 1411) {
        settle.element = "fire";
    } else {
        settle.element = "earth";
    }

    return settle;
};

const generateResult = (result: Result) => {
    const maxNumInRow = 5;
    const rows = [[], [], [], []];
    rows.forEach((row, index) => {
        for (let i = 0; i < maxNumInRow; i++) {
            row.push(result[i + index * maxNumInRow]);
        }
    });

    let shuffle = [];
    for (var i = 1; i <= 20; i++) {
        shuffle.push(i);
    }

    shuffle = _.shuffle(shuffle);

    return rows.map((row, ri) => {
        return (
            <div key={`row-${ri}`}>
                {row.map((num, ni) => {
                    const index = ri * maxNumInRow + ni;
                    return (
                        <div key={index} className={`${Styles["num-animate"]} ${Styles[`animate-${shuffle[index]}`]}`}>
                            <div className={`${Styles[`shown-number-${num >= 10 ? 2 : 1}digit`]} ${Styles["num-pic"]}`}>{num}</div>
                            <div className={`${Styles["num-cover"]}`}></div>
                        </div>
                    );
                })}
            </div>
        );
    });
};

export const KenoProMaxResult: React.FC<{ result?: Result; roundId: number }> = ({ result, roundId }) => {
    const { playResultAnimation, gameSetting } = useGameContext();
    const settleResult = getSettleResult(result);
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());

    return (
        <div className={`${playResultAnimation ? Styles["has-animation"] : ""}`}>
            <div className="overlay-mask">
                <div className={`${Styles["animation-container"]}`}>
                    <div className={Styles["number-container"]}>{generateResult(result)}</div>
                    <div className={Styles["vertical-separator"]}></div>
                    <div className={Styles["result-total"]}>
                        <div className={Styles["result-total-lbl"]}>{t("total")} </div>
                        <div className={Styles["result-total-num"]}>{settleResult.total}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const KenoProMaxResultCollapse: React.FC<{ result: Result; settlementResult: SettlementResult }> = ({
    result,
    settlementResult,
}) => {
    const { playResultAnimation } = useGameContext();
    const { t } = useTranslation("kenopromax");
    return (
        <div className={`${Styles["result-collapse-mode"]} ${playResultAnimation ? Styles["has-animation"] : ""}`}>
            <div className={Styles["result-container"]}></div>

            {!playResultAnimation && settlementResult && (
                <div className={Styles["result-label"]}>{settlementResult?.odd ? t("odd") : t("even")}</div>
            )}
        </div>
    );
};
