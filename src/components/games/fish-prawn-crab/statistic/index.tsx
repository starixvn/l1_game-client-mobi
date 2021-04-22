import React from "react";

import StatisticItem, { countSettlementResult } from "../../../shared/statistic";
import ChoiceIcon from "../item";

type Props = {
    roundHistory: any;
};
const choicesMapper = { stag: 0, gourd: 1, rooster: 2, fish: 3, crab: 4, prawn: 5 };

const StatisticComponent = (props: Props) => {
    const { roundHistory } = props;
    const statisticResult = countSettlementResult(roundHistory);

    return (
        <>
            {Object.keys(choicesMapper).map((choice) => {
                return (
                    <StatisticItem key={choice} value={`${statisticResult[choice]}%`}>
                        <ChoiceIcon type={choicesMapper[choice]} isSmall={true}></ChoiceIcon>
                    </StatisticItem>
                );
            })}
        </>
    );
};

export default StatisticComponent;
