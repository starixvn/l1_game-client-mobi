import React from "react";
import ChoiceIcon from "../choice-icon";
import IconColumn from "../../../shared/round-history/icon-column";

const GetElementRound = (result: any, roundId: number) => {
    const itemValues = Object.values(result);
    return (
        <IconColumn key={roundId}>
            {itemValues.map((value: number, index) => {
                return <ChoiceIcon key={`${roundId}_${index}`} type={value}></ChoiceIcon>;
            })}
        </IconColumn>
    );
};

export default GetElementRound;
