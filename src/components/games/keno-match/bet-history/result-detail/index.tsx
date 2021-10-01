import React from "react";

import { calculateTotalPoint } from "../../../../keno/keno.helper";
import { StateRound } from "../bet-history-hepler";
import TeamResult from "../../../../keno/team-result";
import TeamScore from "../../../../keno/team-score";
import { renderTeamWinningInfo, renderTextWinningForTeam } from "../../../../keno/bet-history/result-detail";
import Styles from "../bet-history.module.scss";

const renderScoreRounds = ({ result, settlementResult, stateRound, translateMapping, total, isFullTime, resultFH }) => {
    const { blue, red } = result;
    const blueScore = isFullTime ? calculateTotalPoint(blue) + calculateTotalPoint(resultFH?.blue ?? []) : calculateTotalPoint(blue);
    const redScore = isFullTime ? calculateTotalPoint(red) + calculateTotalPoint(resultFH?.red ?? []) : calculateTotalPoint(red);
    return (
        <div className={Styles["container-round"]} data-testid="score-round">
            <div className={Styles["container-blue"]}>
                <TeamResult result={blue} customClassName={"ticket-history"} />
                <TeamScore
                    isShowScore={true}
                    teamName={translateMapping?.blue}
                    score={blueScore}
                    isWin={blueScore > redScore}
                    customClassName={"blue"}
                />
            </div>
            <div>
                <div className={Styles["round-name"]}>
                    {stateRound === StateRound.ft ? translateMapping?.fullTime : translateMapping.firstHalf}
                </div>
                <div className={Styles["total-match-section"]}>
                    {translateMapping?.sum}
                    <div className={Styles["total"]}>{total}</div>
                </div>
            </div>

            <div className={Styles["container-red"]}>
                <TeamResult result={red} customClassName={"ticket-history"} />
                <TeamScore
                    isShowScore={true}
                    teamName={translateMapping?.red}
                    score={redScore}
                    isWin={redScore > blueScore}
                    customClassName={"red"}
                />
            </div>

            <div className={Styles["winning-info"]}>
                {renderTextWinningForTeam({ settlementResult, translateMapping })}
                <div className={Styles["sum"]}> {translateMapping?.sum}</div>
                <div className={Styles["result-info"]}>
                    {renderTeamWinningInfo({
                        settlementResult,
                        translateMapping,
                        choices: ["over", "under", "odd", "even"],
                        choiceForClassBlue: ["odd", "even"],
                    })}
                </div>
            </div>
        </div>
    );
};

const RenderScoreDetailKenoMatch = ({ bet, translateMapping }) => {
    const { firstHalf, fullTime } = bet;
    return (
        <>
            {renderScoreRounds({
                result: firstHalf?.result,
                stateRound: StateRound.ht,
                translateMapping,
                total: firstHalf?.sum,
                settlementResult: firstHalf?.settlementResult,
                isFullTime: false,
                resultFH: {},
            })}
            {renderScoreRounds({
                result: fullTime?.result,
                stateRound: StateRound.ft,
                translateMapping,
                total: fullTime?.sum,
                settlementResult: fullTime?.settlementResult,
                isFullTime: true,
                resultFH: firstHalf?.result,
            })}
        </>
    );
};

export default RenderScoreDetailKenoMatch;
