import React from "react";

import { renderTimes } from "../../../../dashboard/history/bet-history";
import { BetLogs, BetDetailProps } from "./../bet-history";
import Styles from "../bet-history.module.scss";

const RenderCellKenoMatch: React.FC<{
    betDetail: BetDetailProps;
    bet: BetLogs;
    translateMapping;
}> = ({ betDetail, bet, translateMapping }) => {
    const { odds, settlementResult } = bet;
    const { time, amount, choice } = betDetail;
    const isHighligh = settlementResult[choice] ? true : false;
    const isShowRefundAmount = settlementResult["tie"] ? true : false;
    const fontNumber = "font-number";
    return (
        <>
            <td className={`${isHighligh ? "highlight" : ""}`} data-testid="bet-time">
                {renderTimes({ time })}
            </td>
            <td className={`${Styles["bet-type"]} ${isHighligh ? "highlight" : ""}`} data-testid="bet-type">
                <span>{getLabelFollowChoice({ translateMapping, choice })}</span>
            </td>
            <td className={`${Styles["bet-choice"]}  ${isHighligh ? "highlight" : ""}`} data-testid="bet-choice">
                {translateMapping[choice]}@<span className={fontNumber}>{odds[choice]}</span>
            </td>
            <td className={`${Styles["stake-refund"]} ${isHighligh ? "highlight" : ""}`} data-testid="bet-stake-refund">
                <span className={`${Styles["stake"]} ${fontNumber}`}>{amount}</span>
                <br></br>
                {isShowRefundAmount && <span className={`${Styles["refund"]} ${fontNumber}`}>{amount}</span>}
            </td>
        </>
    );
};

const getLabelFollowChoice = ({ translateMapping, choice }) => {
    let labelChoice = "";
    if (["red", "blue"].includes(choice)) {
        labelChoice = `${translateMapping["blue"]}/${translateMapping["red"]}`;
    }

    if (["big", "small"].includes(choice)) {
        labelChoice = `${translateMapping["big"]}/${translateMapping["small"]}`;
    }

    if (["odd", "even"].includes(choice)) {
        labelChoice = `${translateMapping["even"]}/${translateMapping["odd"]}`;
    }

    if (["redBig", "redSmall"].includes(choice)) {
        labelChoice = `${translateMapping["teamRedBigSmall"]}`;
    }

    if (["blueBig", "blueSmall"].includes(choice)) {
        labelChoice = `${translateMapping["teamBlueBigSmall"]}`;
    }

    return labelChoice;
};

export default RenderCellKenoMatch;
