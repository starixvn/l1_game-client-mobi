import { useTranslation } from "next-i18next";
import React from "react";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import { RoundDot } from "../../../shared/round-history/dot";
import StatisticItem, { calculatePercent, countSettlementResult } from "../../../shared/statistic";
import { checkIsEven, Choices, MainChoice } from "../se-die-helper";
import { Props } from "./statistic";
import Styles from "./statistic.module.scss";

const StatisticRuleEntries = Object.entries({
    [Choices.even]: (countResult: object, total: number) =>
        countResult[Choices.even] ? Math.round((countResult[Choices.even] * 100) / total) : 0,
    [Choices.odd]: (countResult: object, total: number) =>
        100 - (countResult[Choices.even] ? Math.round((countResult[Choices.even] * 100) / total) : 0),
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
                <StatisticItem key={choice} value={`${statisticResult[choice] ?? 0}%`}>
                    {MainChoice.includes(choice) ? (
                        <span className={`${Styles.title} ${choice === Choices.odd ? Styles["odd"] : Styles["even"]}`}>{t(choice)}</span>
                    ) : (
                        <RoundDot choice={checkIsEven(RedDotMapper[choice]) ? Choices.even : Choices.odd} value={RedDotMapper[choice]} />
                    )}
                </StatisticItem>
            ))}
        </>
    );
};

export default SeDiceStatistic;
