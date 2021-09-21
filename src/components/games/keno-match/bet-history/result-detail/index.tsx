import { TFunction } from "next-i18next";
import React from "react";

import ResultDetailContainer from "../../../../dashboard/history/bet-history/result-detail";
import { GameResourceKeys } from "../../../../../common/resources";
import { Tie } from "../../round-result/main-frame-result/index";
import { calculateTotalPoint, GetTranslateMapping } from "../../keno-match-helper";
import { StateRound } from "../index";
import Styles from "../bet-history.module.scss";

const renderScoreRounds = ({ result, stateRound, translateMapping }) => {
    const { blue, red } = result;
    return (
        <div className={Styles["container-round"]} data-testid="score-round">
            <div className={Styles["container-blue"]}>
                <div className={Styles["score-row"]}>
                    {blue.map((number: number, index: number) => (
                        <Tie key={index} number={number} isBetHistory={true} />
                    ))}
                </div>
                <div className={Styles["blue-label"]}>
                    {translateMapping.blue}:<span className={Styles["score"]}>{calculateTotalPoint(result.blue)}</span>
                </div>
            </div>
            <div className={Styles["round-name"]}>
                {stateRound === StateRound.ft ? translateMapping.fullTime : translateMapping.firstHalf}
            </div>
            <div className={Styles["container-red"]}>
                <div className={Styles["score-row"]}>
                    {red.map((number: number, index: number) => (
                        <Tie key={index} number={number} isBetHistory={true} />
                    ))}
                </div>
                <div className={Styles["red-label"]}>
                    {translateMapping.red}: <span className={Styles["score"]}>{calculateTotalPoint(result.red)}</span>
                </div>
            </div>
        </div>
    );
};

const renderWinningInfo = ({ settlementResult, translateMapping }) => {
    return Object.keys(settlementResult).map((keyName, index) => {
        if (settlementResult[keyName] && ["odd", "even", "over", "under"].includes(keyName)) {
            const classFollowKey = ["odd", "even"].includes(keyName) ? "result-info-red" : "result-info-blue";
            return (
                <div key={index} className={`${Styles[classFollowKey]}`} data-testid="winning-info">
                    {translateMapping[keyName]}
                </div>
            );
        }
        return "";
    });
};

const ResultDetail = (resultDetail, t: TFunction, closeModal: () => void, gameName: string) => {
    if (resultDetail) {
        const { bet, roundId } = resultDetail;
        const { firstHalf, fullTime } = bet;
        const translateMapping = GetTranslateMapping(t, gameName);
        return (
            <ResultDetailContainer roundId={roundId} closeModal={closeModal} gameName={t(`${gameName}:${GameResourceKeys.GAME_NAME}`)}>
                <div className={Styles["result-details"]} data-testid="result-details">
                    {renderScoreRounds({ result: firstHalf?.result, stateRound: StateRound.ht, translateMapping })}
                    {renderScoreRounds({ result: fullTime?.result, stateRound: StateRound.ft, translateMapping })}
                    <div className={Styles["round-label"]}>
                        {translateMapping.firstHalf} - {translateMapping.sum}
                    </div>
                    <div className={Styles["winning-info"]}>
                        <div className={Styles["result-info"]}>
                            {renderWinningInfo({ settlementResult: firstHalf?.settlementResult, translateMapping })}
                        </div>

                        <div className={Styles["total-section"]}>
                            {translateMapping.total}
                            <div className={Styles["total"]}>{firstHalf?.sum}</div>
                        </div>
                    </div>
                    <div className={Styles["round-label"]}>
                        {translateMapping.fullTime} - {translateMapping.sum}
                    </div>
                    <div className={Styles["winning-info"]}>
                        <div className={Styles["result-info"]}>
                            {renderWinningInfo({ settlementResult: fullTime?.settlementResult, translateMapping })}
                        </div>

                        <div className={Styles["total-section"]}>
                            {translateMapping.total}
                            <div className={Styles["total"]}>{firstHalf?.sum}</div>
                        </div>
                    </div>
                </div>
            </ResultDetailContainer>
        );
    }
    return <></>;
};

export default ResultDetail;
