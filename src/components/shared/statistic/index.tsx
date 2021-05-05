import React from "react";
import { Round } from "../../../types";
import { useTranslation } from "next-i18next";
import { useGameContext } from "../../../contexts/game-context/game-context";
import Styles from "./statistic.module.scss";

type Props = {
    children: React.ReactNode;
    value: string | number;
};

type PropsPercent = {
    roundHistory: Round<any, any>[];
    statisticRuleEntries: [string, (countResult: object, total: number) => number][];
};

export const countSettlementResult = (roundHistory: Round<any, any>[]) => {
    return roundHistory.reduce((result, { settlementResult }) => {
        for (const [choice, win] of Object.entries(settlementResult)) {
            if (win) {
                result[choice] = result[choice] ? (result[choice] += 1) : 1;
            }
        }
        return result;
    }, {});
};

export const calculatePercent = (
    statisticRuleEntries: [string, (countResult: object, total: number) => number][],
    countResult: object,
    total: number
) => {
    return statisticRuleEntries.reduce((result, [choice, rule]) => {
        result[choice] = rule(countResult, total);
        return result;
    }, {});
};

const StatisticItem: React.FC<Props> = (props) => {
    return (
        <div className={Styles["statistic-group"]}>
            {props.children}
            <span className={Styles["number"]}>{props.value}</span>
        </div>
    );
};

export const StatisticFollowPercent: React.FC<PropsPercent> = (props) => {
    const { statisticRuleEntries, roundHistory } = props;
    const { gameSetting } = useGameContext();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());
    const statisticResult = calculatePercent(statisticRuleEntries, countSettlementResult(roundHistory), roundHistory.length);
    return (
        <>
            {Object.keys(statisticResult).map((choice) => (
                <StatisticItem key={choice} value={`${statisticResult[choice]}%`}>
                    <span className={Styles[choice]}>{t(choice)}</span>
                </StatisticItem>
            ))}
        </>
    );
};

export default StatisticItem;
