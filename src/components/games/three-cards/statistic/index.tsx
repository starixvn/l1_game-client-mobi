import { useTranslation } from "next-i18next";
import React, { useMemo } from "react";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import StatisticItem, { calculatePercent, countSettlementResult } from "../../../shared/statistic";
import { Choices, TabsValue } from "../three-cards-helper";
import Styles from "./statistic.module.scss";

const calculateEntryPercent = (countResult: object, total: number, choice: string) =>
    countResult[choice] ? Math.round((countResult[choice] * 100) / total) : 0;

const StatisticRuleEntriesRedBlack = Object.entries({
    [Choices.red]: (countResult: object, total: number) => calculateEntryPercent(countResult, total, Choices.red),
    [Choices.black]: (countResult: object, total: number) => calculateEntryPercent(countResult, total, Choices.black),
});

const StatisticRuleEntriesSuits = Object.entries({
    [Choices.diamonds]: (countResult: object, _) => countResult[Choices.diamonds],
    [Choices.hearts]: (countResult: object, _) => countResult[Choices.hearts],
    [Choices.spades]: (countResult: object, _) => countResult[Choices.spades],
    [Choices.clubs]: (countResult: object, _) => countResult[Choices.clubs],
});

const RedBlackStatistics = ({ roundHistory, statisticRuleEntries, t }) => {
    const statisticResult = calculatePercent(statisticRuleEntries, countSettlementResult(roundHistory), roundHistory.length);

    return (
        <>
            {Object.keys(statisticResult).map((choice) => (
                <StatisticItem key={choice} value={`${statisticResult[choice] ?? 0}%`}>
                    <span className={`${Styles.title} ${Styles[choice]}`}>{t(choice)}</span>
                </StatisticItem>
            ))}
        </>
    );
};

const SuitStatistics = ({ roundHistory, statisticRuleEntries, t }) => {
    const statisticResult = calculatePercent(statisticRuleEntries, countSettlementResult(roundHistory), roundHistory.length);

    return (
        <>
            {Object.keys(statisticResult).map((choice) => (
                <StatisticItem key={choice} value={`${statisticResult[choice] ?? 0}`}>
                    <img
                        srcSet={`/static/images/three-cards/${Choices[choice]}.png 1x, /static/images/three-cards/${Choices[choice]}@2x.png 2x, /static/images/three-cards/${Choices[choice]}@3x.png 3x`}
                        className={Styles["card-suite"]}
                        alt="suite"
                        width="18"
                        height="18"
                    ></img>
                </StatisticItem>
            ))}
        </>
    );
};
const ThreeCardsStatistic = ({ roundHistory, statisticRuleEntries, activeScoreboardTab }) => {
    const { gameSetting } = useGameContext();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());

    return useMemo(() => {
        if (activeScoreboardTab === TabsValue.redBlack) {
            return RedBlackStatistics({ roundHistory, statisticRuleEntries, t });
        } else {
            return SuitStatistics({ roundHistory, statisticRuleEntries, t });
        }
    }, [roundHistory, activeScoreboardTab]);
};

export default ThreeCardsStatistic;

export const StatisticRuleMapping = [StatisticRuleEntriesRedBlack, StatisticRuleEntriesSuits];
