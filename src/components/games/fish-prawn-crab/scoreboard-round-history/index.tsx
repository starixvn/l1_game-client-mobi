import React from "react";
import ChoiceIcon, { ChoiceIconCompactMode } from "../choice-icon";
import IconColumn, { IconColumnCompactMode } from "../../../shared/round-history/icon-column";

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

export const GetElementRoundOfCompactMode = (result: any, roundId: number) => {
    const itemValues = Object.values(result);
    return (
        <IconColumnCompactMode key={roundId}>
            {itemValues.map((value: number, index) => {
                return <ChoiceIconCompactMode key={`${roundId}_${index}`} type={value}></ChoiceIconCompactMode>;
            })}
        </IconColumnCompactMode>
    );
};

export default GetElementRound;
