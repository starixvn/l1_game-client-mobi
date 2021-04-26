import React from "react";

import StatisticItem, { countSettlementResult } from "../../../shared/statistic";
import ChoiceIcon from "../choice-icon";
import { choicesMapper } from "../index";

type Props = {
    roundHistory: any;
};

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
