import React from "react";
import { numberWithCommas } from "../../../../../helpers/number-helper";

import { renderTimes } from "../../../../dashboard/history/bet-history/bet-row";
import { renderRefund, RenderCell } from "../../../../keno/bet-history/bet-history-details";
import { BetLogs, BetDetailProps } from "./../bet-history";

const RenderRowKenoMatch: React.FC<{
    betDetail: BetDetailProps;
    bet: BetLogs;
    translateMapping;
    fractionalOddsFormat: boolean | undefined;
}> = ({ betDetail, bet, translateMapping, fractionalOddsFormat }) => {
    const { odds, settlementResult } = bet;
    const { time, amount, choice } = betDetail;
    const isHighligh = settlementResult[choice] ? true : false;
    const isShowRefundAmount = settlementResult["tie"] && ["blue", "red"].includes(choice) ? true : false;
    return (
        <>
            <RenderCell isHighligh={isHighligh} name={"bet-time"}>
                {renderTimes({ time })}
            </RenderCell>

            <RenderCell isHighligh={isHighligh} name={"bet-type"}>
                <span>{getLabelFollowChoice({ translateMapping, choice })}</span>
            </RenderCell>
            <RenderCell isHighligh={isHighligh} name={"bet-choice"}>
                {translateMapping[choice]}@
                <span className="font-number">
                    {fractionalOddsFormat && odds[choice] ? numberWithCommas(+odds[choice] - 1) : odds?.[choice] || ""}
                </span>
            </RenderCell>
            <RenderCell isHighligh={isHighligh} name={"stake-refund"}>
                {renderRefund({ amount, isShowRefundAmount })}
            </RenderCell>
        </>
    );
};

const getLabelFollowChoice = ({ translateMapping, choice }) => {
    let labelChoice = "";
    if (["red", "blue"].includes(choice)) {
        labelChoice = `${translateMapping["blue"]}/${translateMapping["red"]}`;
    }

    if (["big", "small"].includes(choice)) {
        labelChoice = `${translateMapping["sum"]} ${translateMapping["big"]}/${translateMapping["small"]}`;
    }

    if (["odd", "even"].includes(choice)) {
        labelChoice = `${translateMapping["sum"]} ${translateMapping["even"]}/${translateMapping["odd"]}`;
    }

    if (["redBig", "redSmall"].includes(choice)) {
        labelChoice = `${translateMapping["teamRedBigSmall"]}`;
    }

    if (["blueBig", "blueSmall"].includes(choice)) {
        labelChoice = `${translateMapping["teamBlueBigSmall"]}`;
    }

    return labelChoice;
};

export default RenderRowKenoMatch;
