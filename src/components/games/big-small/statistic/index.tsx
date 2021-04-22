import { useTranslation } from "next-i18next";
import React from "react";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import StatisticItem, { calculatePercent, countSettlementResult } from "../../../shared/statistic";
import { Choices } from "../big-small-helper";
import { Props } from "./statistic";
import Styles from "./statistic.module.scss";

const StatisticRuleEntries = Object.entries({
    [Choices.big]: (countResult: object, total: number) => Math.round((countResult[Choices.big] * 100) / total),
    [Choices.small]: (countResult: object, total: number) => 100 - Math.round((countResult[Choices.small] * 100) / total),
});

const BigSmallStatistic = (props: Props) => {
    const { roundHistory } = props;
    const { gameSetting } = useGameContext();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());
    const statisticResult = calculatePercent(StatisticRuleEntries, countSettlementResult(roundHistory), roundHistory.length);

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

export default BigSmallStatistic;
