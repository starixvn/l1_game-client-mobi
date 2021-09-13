import { TFunction } from "next-i18next";
import React from "react";

import ResultDetailContainer from "../../../dashboard/history/bet-history/result-detail";
import BetHistoryContainer, { renderHeaderRows, renderTimes } from "../../../dashboard/history/bet-history";
import { BetLogs, BetDetailProps } from "./bet-history";
import { GameResourceKeys } from "../../../../common/resources";
import { Tie } from "../round-result/half-round-result";
import { calculateTotalPoint, GetTranslateMapping } from "../keno-match-helper";
import Styles from "./bet-history.module.scss";

enum StateRound {
    ht,
    ft,
    live,
}

const renderResultDetail = (resultDetail, t: TFunction, closeModal: () => void, gameName: string) => {
    if (resultDetail) {
        const { bet, roundId } = resultDetail;
        const { firstHalf, fullTime } = bet;
        const translateMapping = GetTranslateMapping(t, gameName);
        return (
            <ResultDetailContainer roundId={roundId} closeModal={closeModal} gameName={t(`${gameName}:${GameResourceKeys.GAME_NAME}`)}>
                <div className={Styles["result-details"]}>
                    {renderScoreRounds({ result: firstHalf?.result, stateRound: StateRound.ht, translateMapping })}
                    <span></span>
                    {renderScoreRounds({ result: fullTime?.result, stateRound: StateRound.ft, translateMapping })}
                    <div className={Styles["round-label"]}>
                        {translateMapping.firstHalf}-{translateMapping.sum}
                    </div>
                    <div className={Styles["winning-info"]}>
                        <div className={Styles["result-info"]}>
                            {renderWinningInfo({ settlementResult: firstHalf?.settlementResult, translateMapping })}
                        </div>

                        <div>
                            {translateMapping.total}
                            <br></br>
                            <span className={Styles["total"]}>{firstHalf?.sum}</span>
                        </div>
                    </div>
                    <div className={Styles["round-label"]}>
                        {translateMapping.fullTime}-{translateMapping.sum}
                    </div>
                    <div className={Styles["winning-info"]}>
                        <div className={Styles["result-info"]}>
                            {renderWinningInfo({ settlementResult: fullTime?.settlementResult, translateMapping })}
                        </div>

                        <div>
                            {translateMapping.total}
                            <br></br>
                            <span className={Styles["total"]}>{firstHalf?.sum}</span>
                        </div>
                    </div>
                </div>
            </ResultDetailContainer>
        );
    }
    return <></>;
};

const renderWinningInfo = ({ settlementResult, translateMapping }) => {
    return Object.keys(settlementResult).map((keyName, index) => {
        settlementResult[keyName] && ["odd", "even", "over", "under"].includes(keyName);
        return (
            <div key={index} className={Styles["result-info-red"]}>
                {translateMapping[keyName]}
            </div>
        );
    });
};

const renderScoreRounds = ({ result, stateRound, translateMapping }) => {
    const { blue, red } = result;
    return (
        <div className={Styles["container-round"]}>
            <div className={Styles["container-blue"]}>
                <div className={Styles["score-row"]}>
                    {blue.map((number: number, index: number) => (
                        <Tie key={index} number={number} />
                    ))}
                </div>
                <div className={Styles["blue-label"]}>
                    {translateMapping.blue}:{calculateTotalPoint(result.blue)}
                </div>
            </div>
            <div className={Styles["round-name"]}>
                {stateRound === StateRound.ft ? translateMapping.fullTime : translateMapping.firstHalf}
            </div>
            <div className={Styles["container-red"]}>
                <div className={Styles["score-row"]}>
                    {red.map((number: number, index: number) => (
                        <Tie key={index} number={number} />
                    ))}
                </div>
                <div className={Styles["red-label"]}>
                    {translateMapping.red}:{calculateTotalPoint(result.red)}
                </div>
            </div>
        </div>
    );
};

const detectStateRound = (choice: string) => {
    let stateRound = StateRound.ht;

    if (choice.includes("ft")) {
        stateRound = StateRound.ft;
    } else if (choice.includes("liveFT")) {
        stateRound = StateRound.live;
    }

    return stateRound;
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

const renderBetLogsDetails = ({ betLog, gameName, t, setIsShowResultDetail }) => {
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
                <div>
                    {t(`${gameName}:game_name`)} - {t("round")}: {roundId}
                </div>
                <div onClick={() => clickOpenDetails()}>
                    {t("result")}:<span className={Styles["details"]}>{t("details")}</span>
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

const KenoMatchBetHistory: React.FunctionComponent<{ gameId: number; closeModal: () => void }> = ({ gameId, closeModal }) => {
    return (
        <BetHistoryContainer
            gameId={gameId}
            isRefund={false}
            renderResultDetail={(resultDetail: any, t: TFunction, closeModal: () => void, gameName: string) =>
                renderResultDetail(resultDetail, t, closeModal, gameName)
            }
            closeModal={closeModal}
            renderBetLogsDetails={renderBetLogsDetails}
            nameHeaderOnTable={["roundTime", "round", "totalStake", "win"]}
        ></BetHistoryContainer>
    );
};

export default KenoMatchBetHistory;
