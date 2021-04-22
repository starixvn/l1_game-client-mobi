import { useTranslation } from "next-i18next";
import React from "react";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import StatisticItem, { calculatePercent, countSettlementResult } from "../../../shared/statistic";
import SeDieDot from "../dot";
import { checkIsEven, Choices, MainChoice } from "../se-die-helper";
import { Props } from "./statistic";
import Styles from "./statistic.module.scss";

const StatisticRuleEntries = Object.entries({
    [Choices.even]: (countResult: object, total: number) => 100 - Math.round((countResult[Choices.odd] * 100) / total),
    [Choices.odd]: (countResult: object, total: number) => Math.round((countResult[Choices.odd] * 100) / total),
    [Choices.white4]: (countResult: object, total: number) => Math.round((countResult[Choices.white4] * 100) / total),
    [Choices.white3]: (countResult: object, total: number) =>
        Math.round((countResult[Choices.odd] * 100) / total) - Math.round((countResult[Choices.red3] * 100) / total),
    [Choices.red2]: (countResult: object, total: number) =>
        100 -
        Math.round((countResult[Choices.odd] * 100) / total) -
        Math.round((countResult[Choices.red4] * 100) / total) -
        Math.round((countResult[Choices.white4] * 100) / total),
    [Choices.red3]: (countResult: object, total: number) => Math.round((countResult[Choices.red3] * 100) / total),
    [Choices.red4]: (countResult: object, total: number) => Math.round((countResult[Choices.red4] * 100) / total),
});

const RedDotMapper = {
    [Choices.white4]: 0,
    [Choices.white3]: 1,
    [Choices.red2]: 2,
    [Choices.red3]: 3,
    [Choices.red4]: 4,
};

const SeDiceStatistic = (props: Props) => {
    const { roundHistory } = props;
    const { gameSetting } = useGameContext();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());

    const statisticResult = calculatePercent(StatisticRuleEntries, countSettlementResult(roundHistory), roundHistory.length);

    return (
        <>
            {Object.keys(statisticResult).map((choice) => (
                <StatisticItem key={choice} value={`${statisticResult[choice]}%`}>
                    {MainChoice.includes(choice) ? (
                        <span className={`${Styles.title} ${choice === Choices.odd ? Styles.red : ""}`}>{t(choice)}</span>
                    ) : (
                        <SeDieDot red={checkIsEven(RedDotMapper[choice])} value={RedDotMapper[choice]} />
                    )}
                </StatisticItem>
            ))}
        </>
    );
};

export default SeDiceStatistic;
