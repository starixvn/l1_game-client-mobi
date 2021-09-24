import { TFunction } from "next-i18next";
import React from "react";

import ResultDetailContainer from "../../../../dashboard/history/bet-history/result-detail";
import { GameResourceKeys } from "../../../../../common/resources";
import { calculateTotalPoint, GetTranslateMapping, Choices } from "../../keno-match-helper";
import { StateRound } from "../index";
import TeamResult from "../../../../keno/team-result";
import TeamScore from "../../../../keno/team-score";
import Styles from "../bet-history.module.scss";

const renderScoreRounds = ({ result, settlementResult, stateRound, translateMapping, total }) => {
    const { blue, red } = result;
    const blueScore = calculateTotalPoint(blue);
    const redScore = calculateTotalPoint(red);
    return (
        <div className={Styles["container-round"]} data-testid="score-round">
            <div className={Styles["container-blue"]}>
                <TeamResult result={blue} customClassName={"ticket-history"} />
                <TeamScore teamName={translateMapping.blue} score={blueScore} isWin={blueScore > redScore} customClassName={"blue"} />
            </div>
            <div>
                <div className={Styles["round-name"]}>
                    {stateRound === StateRound.ft ? translateMapping.fullTime : translateMapping.firstHalf}
                </div>
                <div className={Styles["total-match-section"]}>
                    {translateMapping.sum}
                    <div className={Styles["total"]}>{total}</div>
                </div>
            </div>

            <div className={Styles["container-red"]}>
                <TeamResult result={red} customClassName={"ticket-history"} />
                <TeamScore teamName={translateMapping.red} score={redScore} isWin={redScore > blueScore} customClassName={"red"} />
            </div>

            <div className={Styles["winning-info"]}>
                {renderTextWinningForTeam({ settlementResult, translateMapping })}
                <div> {translateMapping.sum}</div>
                <div className={Styles["result-info"]}>{renderWinningInfo({ settlementResult, translateMapping })}</div>
            </div>
        </div>
    );
};

const renderTextWinningForTeam = ({ settlementResult, translateMapping }) => {
    const classFollowTeam = settlementResult?.tie ? Choices.tie : settlementResult?.blue ? Choices.blue : Choices.red;
    return (
        <div className={`${Styles["team-win"]} ${Styles[classFollowTeam]}`}>
            {settlementResult?.tie ? translateMapping.tie : settlementResult?.blue ? translateMapping.blueWin : translateMapping.redWin}
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
                    {renderScoreRounds({
                        result: firstHalf?.result,
                        stateRound: StateRound.ht,
                        translateMapping,
                        total: firstHalf?.sum,
                        settlementResult: firstHalf?.settlementResult,
                    })}
                    {renderScoreRounds({
                        result: fullTime?.result,
                        stateRound: StateRound.ft,
                        translateMapping,
                        total: fullTime?.sum,
                        settlementResult: fullTime?.settlementResult,
                    })}
                </div>
            </ResultDetailContainer>
        );
    }
    return <></>;
};

export default ResultDetail;
