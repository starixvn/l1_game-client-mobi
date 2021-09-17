import React from "react";

import { renderHeaderRows, renderTimes } from "../../../../dashboard/history/bet-history";
import { BetLogs, BetDetailProps } from "./../bet-history";
import { GetTranslateMapping } from "../../keno-match-helper";
import { detectStateRound, StateRound } from "../index";
import Styles from "../bet-history.module.scss";

const RenderCell: React.FC<{
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
            <td className={`${isHighligh ? "highlight" : ""}`}>{renderTimes({ time })}</td>
            <td className={`${Styles["bet-type"]} ${isHighligh ? "highlight" : ""}`}>
                <span>{stateRound === StateRound.ht ? translateMapping.firstHalf : translateMapping.fullTime}</span> <br></br>
                <span>
                    {getLabelFollowChoice({ translateMapping, formatChoice })}
                    {liveLabel}
                </span>
            </td>
            <td className={`${Styles["bet-choice"]}  ${isHighligh ? "highlight" : ""}`}>
                {translateMapping[formatChoice]}@<span className={fontNumber}>{odds[choice]}</span>
            </td>
            <td className={`${Styles["stake-refund"]} ${isHighligh ? "highlight" : ""}`}>
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

const BetLogsDetails = ({ betLog, gameName, t, setIsShowResultDetail }) => {
    if (betLog) {
        const { bet, roundId } = betLog;
        const { betLogDetails } = bet;
        const headerName = ["roundTime", "betType", "betChoice", "refund"];

        const clickOpenDetails = () => {
            setIsShowResultDetail(true);
        };

        const translateMapping = GetTranslateMapping(t, gameName);

        return (
            <>
                <div className={Styles["top-title"]}>
                    <div>
                        {t(`${gameName}:game_name`)} - {t("round")}: {roundId}
                    </div>
                    <div onClick={() => clickOpenDetails()}>
                        {t("result")}:<span className={Styles["details"]}>{t("details")}</span>
                    </div>
                </div>
                <div className={`table-container react-infinite-table ${Styles["bet-logs-table"]}`}>
                    <table className="table text-center">
                        <thead>{renderHeaderRows({ headerName, t })}</thead>
                        <tbody>
                            {betLogDetails.length > 0 &&
                                betLogDetails.map((betLog: any, index: number) => {
                                    return (
                                        <tr key={index} className={bet.betwin > 0 ? "highlight" : ""}>
                                            {RenderCell({
                                                betDetail: betLog,
                                                bet: bet,
                                                translateMapping: translateMapping,
                                            })}
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>
            </>
        );
    }
    return <></>;
};

export default BetLogsDetails;
