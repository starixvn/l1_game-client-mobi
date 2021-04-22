import { useTranslation } from "next-i18next";
import React from "react";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import StatisticItem, { calculatePercent, countSettlementResult } from "../../../shared/statistic";
import { Choices } from "../dragon-tiger-helper";
import { Props } from "./statistic";
import Styles from "./statistic.module.scss";

const StatisticRuleEntries = Object.entries({
    [Choices.dragon]: (countResult: object, total: number) => Math.round((countResult[Choices.dragon] * 100) / total),
    [Choices.tiger]: (countResult: object, total: number) => Math.round((countResult[Choices.tiger] * 100) / total),
    [Choices.tie]: (countResult: object, total: number) =>
        100 - Math.round((countResult[Choices.dragon] * 100) / total) - Math.round((countResult[Choices.tiger] * 100) / total),
});

const DragonTigerStatistic = (props: Props) => {
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

export default DragonTigerStatistic;
