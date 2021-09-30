import React from "react";

import { renderTimes } from "../../../../dashboard/history/bet-history";
import { BetLogs, BetDetailProps } from "./../bet-history";
import { detectStateRound, StateRound } from "../bet-history-hepler";
import Styles from "../bet-history.module.scss";

const RenderRowKenoMatch: React.FC<{
    betDetail: BetDetailProps;
    bet: BetLogs;
    translateMapping;
}> = ({ betDetail, bet, translateMapping }) => {
    const { odds, firstHalf, fullTime } = bet;
    const { time, amount, choice } = betDetail;
    const stateRound = detectStateRound(choice);
    const formatChoice = stateRound === StateRound.live ? choice.slice(6).toLowerCase() : choice.slice(2).toLowerCase();
    const settlementResult = stateRound === StateRound.live ? fullTime.settlementResult : firstHalf.settlementResult;
    const isHighligh = settlementResult[formatChoice] ? true : false;
    const isShowRefundAmount = settlementResult["tie"] ? true : false;
    const liveLabel = stateRound === StateRound.live ? `(${translateMapping["live"]})` : "";
    const fontNumber = "font-number";

    return (
        <>
            <td className={`${isHighligh ? "highlight" : ""}`} data-testid="bet-time">
                {renderTimes({ time })}
            </td>
            <td className={`${Styles["bet-type"]} ${isHighligh ? "highlight" : ""}`} data-testid="bet-type">
                <span>{stateRound === StateRound.ht ? translateMapping.firstHalf : translateMapping.fullTime}</span> <br></br>
                <span>
                    {getLabelFollowChoice({ translateMapping, formatChoice })}
                    {liveLabel}
                </span>
            </td>
            <td className={`${Styles["bet-choice"]}  ${isHighligh ? "highlight" : ""}`} data-testid="bet-choice">
                {translateMapping[formatChoice]}@<span className={fontNumber}>{odds[choice]}</span>
            </td>
            <td className={`${Styles["stake-refund"]} ${isHighligh ? "highlight" : ""}`} data-testid="bet-stake-refund">
                <span className={`${Styles["stake"]} ${fontNumber}`}>{amount}</span>
                <br></br>
                {isShowRefundAmount && <span className={`${Styles["refund"]} ${fontNumber}`}>{amount}</span>}
            </td>
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
