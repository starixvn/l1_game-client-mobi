import { useTranslation } from "next-i18next";
import React, { useMemo } from "react";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import StatisticItem, { calculatePercent, countSettlementResult } from "../../../shared/statistic";
import { Choices } from "../three-cards-helper";
import Styles from "./statistic.module.scss";
import { TabsValue } from "../tabs";

const calculateEntryPercent = (countResult: object, total: number, choice: string) =>
    countResult[choice] ? Math.round((countResult[choice] * 100) / total) : 0;

const StatisticRuleEntriesRedBlack = Object.entries({
    [Choices.black]: (countResult: object, total: number) => calculateEntryPercent(countResult, total, Choices.black),
    [Choices.red]: (countResult: object, total: number) => calculateEntryPercent(countResult, total, Choices.red),
});

const StatisticRuleEntriesSuits = Object.entries({
    [Choices.diamond]: (countResult: object, _) => countResult[Choices.diamond],
    [Choices.heart]: (countResult: object, _) => countResult[Choices.heart],
    [Choices.spade]: (countResult: object, _) => countResult[Choices.spade],
    [Choices.club]: (countResult: object, _) => countResult[Choices.club],
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
    const choiceIcons = { diamond: "diamond", heart: "heart", spade: "spade", club: "club" };

    return (
        <>
            {Object.keys(statisticResult).map((choice) => (
                <StatisticItem key={choice} value={`${statisticResult[choice] ?? 0}`}>
                    <img
                        src={`/static/images/three-cards/${choiceIcons[choice]}.svg`}
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
const ThreeCardsStatistic = ({ roundHistory, statisticRuleEntries, tabsScoreboardValue }) => {
    const { gameSetting } = useGameContext();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());

    return useMemo(() => {
        switch (tabsScoreboardValue) {
            case TabsValue.redBlack:
                return RedBlackStatistics({ roundHistory, statisticRuleEntries, t });
            default:
                return SuitStatistics({ roundHistory, statisticRuleEntries, t });
        }
    }, [roundHistory, tabsScoreboardValue]);
};

export default ThreeCardsStatistic;

export const StatisticRuleMapping = [StatisticRuleEntriesRedBlack, StatisticRuleEntriesSuits];
