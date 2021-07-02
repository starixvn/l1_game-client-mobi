import { useTranslation } from "next-i18next";
import React, { useMemo } from "react";

import { useGameContext } from "../../../contexts/game-context/game-context";
import { Round } from "../../../types";
import Styles from "./statistic.module.scss";
import { Props, PropsFollowPercent } from "./types";

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

export const StatisticFollowPercent: React.FC<PropsFollowPercent> = (props) => {
    const { statisticRuleEntries, roundHistory } = props;
    const { gameSetting } = useGameContext();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());

    return useMemo(() => {
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
    }, [roundHistory]);
};

export default StatisticItem;
