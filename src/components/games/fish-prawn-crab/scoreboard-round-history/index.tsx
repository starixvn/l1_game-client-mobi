import React from "react";
import Item from "../item";
import IconColumn from "../../../shared/round-history/icon-column";

const GetElementRound = (result: any, roundId: number) => {
    const itemValues = Object.values(result);
    return (
        <IconColumn key={roundId}>
            {itemValues.map((value: number, index) => {
                return <Item key={`${roundId}_${index}`} type={value}></Item>;
            })}
        </IconColumn>
    );
};

export default GetElementRound;
