import { useTranslation } from "next-i18next";
import React, { useMemo } from "react";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import StatisticItem, { calculatePercent, countSettlementResult } from "../../../shared/statistic";
import { Choices, TabsValue, ChoiceSuitOrder, SuitKeys } from "../three-cards-helper";
import { Round } from "../../../../types";
import Styles from "./statistic.module.scss";

const calculateEntryPercent = (countResult: object, total: number, choice: string) =>
    countResult[choice] ? Math.round((countResult[choice] * 100) / total) : 0;

const StatisticRuleEntriesRedBlack = Object.entries({
    [Choices.red]: (countResult: object, total: number) => calculateEntryPercent(countResult, total, Choices.red),
    [Choices.black]: (countResult: object, total: number) => calculateEntryPercent(countResult, total, Choices.black),
});

const countResult = (roundHistory: Round<any, any>[]) => {
    return roundHistory.reduce((resultCount, { result }) => {
        Object.values(result).forEach((card: any) => {
            resultCount[SuitKeys[card.suit]] = (resultCount[SuitKeys[card.suit]] ?? 0) + 1;
        });
        return resultCount;
    }, {});
};

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

const SuitStatistics = ({ roundHistory }) => {
    const statisticResult = countResult(roundHistory);

    return (
        <>
            {ChoiceSuitOrder.map((choice) => (
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
            return SuitStatistics({ roundHistory });
        }
    }, [roundHistory, activeScoreboardTab]);
};

export default ThreeCardsStatistic;

export const StatisticRuleMapping = [StatisticRuleEntriesRedBlack];
