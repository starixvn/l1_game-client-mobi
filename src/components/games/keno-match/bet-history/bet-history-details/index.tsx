import React from "react";

import { renderTimes } from "../../../../dashboard/history/bet-history/bet-row";
import { RenderCell, renderRefund } from "../../../../keno/bet-history/bet-history-details";
import { BetLogs, BetDetailProps } from "./../bet-history";
import { detectStateRound, StateRound } from "../bet-history-helper";

const choiceRefundAmount = ["fhBlue", "fhRed", "ftBlue", "ftRed", "liveFTRed", "liveFTBlue"];
const RenderRowKenoMatch: React.FC<{
    betDetail: BetDetailProps;
    bet: BetLogs;
    translateMapping;
}> = ({ betDetail, bet, translateMapping }) => {
    const { odds, firstHalf, fullTime } = bet;
    const { time, amount, choice } = betDetail;
    const stateRound = detectStateRound(choice);
    const formatChoice = stateRound === StateRound.live ? choice.slice(6).toLowerCase() : choice.slice(2).toLowerCase();
    const settlementResult = stateRound === StateRound.ht ? firstHalf.settlementResult : fullTime.settlementResult;
    const isHighligh = settlementResult[formatChoice] ? true : false;
    const isShowRefundAmount = settlementResult["tie"] && choiceRefundAmount.includes(choice) ? true : false;
    const liveLabel = stateRound === StateRound.live ? `(${translateMapping["live"]})` : "";

    return (
        <>
            <RenderCell isHighligh={isHighligh} name={"bet-time"}>
                {renderTimes({ time })}
            </RenderCell>

            <RenderCell isHighligh={isHighligh} name={"bet-type"}>
                <span>{stateRound === StateRound.ht ? translateMapping.firstHalf : translateMapping.fullTime}</span> <br></br>
                <span>
                    {getLabelFollowChoice({ translateMapping, formatChoice })}
                    {liveLabel}
                </span>
            </RenderCell>
            <RenderCell isHighligh={isHighligh} name={"bet-choice"}>
                {translateMapping[formatChoice]}@<span className="font-number">{odds[choice]}</span>
            </RenderCell>
            <RenderCell isHighligh={isHighligh} name={"stake-refund"}>
                {renderRefund({ amount, isShowRefundAmount })}
            </RenderCell>
        </>
    );
};

const getLabelFollowChoice = ({ translateMapping, formatChoice }) => {
    let labelChoice = "";
    if (["red", "blue"].includes(formatChoice)) {
        labelChoice = `${translateMapping["blue"]}/${translateMapping["red"]}`;
    }

    if (["over", "under"].includes(formatChoice)) {
        labelChoice = `${translateMapping["over"]}/${translateMapping["under"]}`;
    }

    if (["odd", "even"].includes(formatChoice)) {
        labelChoice = `${translateMapping["even"]}/${translateMapping["odd"]}`;
    }
    return labelChoice;
};

export default RenderRowKenoMatch;
