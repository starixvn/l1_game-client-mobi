import React from "react";

import StatisticItem from "../../../shared/statistic";
import ChoiceIcon from "../choice-icon";
import { Round } from "../../../../types";
import { choicesMapper } from "../index";

type Props = {
    roundHistory: any;
};

const countResult = (roundHistory: Round<any, any>[]) => {
    return roundHistory.reduce((resultCount, { result }) => {
        Object.values(result).forEach((character: number) => {
            resultCount[character] = (resultCount[character] ?? 0) + 1;
        });
        return resultCount;
    }, {});
};

const StatisticComponent = (props: Props) => {
    const { roundHistory } = props;
    const statisticResult = countResult(roundHistory);
    return (
        <>
            {Object.keys(choicesMapper).map((choice) => {
                return (
                    <StatisticItem key={choice} value={`${statisticResult[choicesMapper[choice]]}`}>
                        <ChoiceIcon type={choicesMapper[choice]} isSmall={true}></ChoiceIcon>
                    </StatisticItem>
                );
            })}
        </>
    );
};

export default StatisticComponent;
