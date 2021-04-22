import React from "react";

import StatisticItem, { countSettlementResult } from "../../../shared/statistic";
import Item from "../item";

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
                        <Item type={choicesMapper[choice]} isSmall={true}></Item>
                    </StatisticItem>
                );
            })}
        </>
    );
};

export default StatisticComponent;
