import { useTranslation } from "next-i18next";
import React, { useMemo } from "react";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import StatisticItem, { calculatePercent, countSettlementResult } from "../../../shared/statistic";
import { Choices } from "../three-cards-helper";
import Styles from "./statistic.module.scss";

const StatisticRuleEntries = Object.entries({
    [Choices.black]: (countResult: object, total: number) =>
        countResult[Choices.black] ? Math.round((countResult[Choices.black] * 100) / total) : 0,

    [Choices.red]: (countResult: object, total: number) =>
        100 - (countResult[Choices.black] ? Math.round((countResult[Choices.black] * 100) / total) : 0),
});

const ThreeCardsStatistic = ({ roundHistory }) => {
    const { gameSetting } = useGameContext();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());

    return useMemo(() => {
        const statisticResult = calculatePercent(StatisticRuleEntries, countSettlementResult(roundHistory), roundHistory.length);

        return (
            <>
                {Object.keys(statisticResult).map((choice) => (
                    <StatisticItem key={choice} value={`${statisticResult[choice] ?? 0}%`}>
                        <span className={`${Styles.title} ${Styles[choice]}`}>{t(choice)}</span>
                    </StatisticItem>
                ))}
            </>
        );
    }, [roundHistory]);
};

export default ThreeCardsStatistic;
