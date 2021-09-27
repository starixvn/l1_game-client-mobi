import React from "react";

import { Choices } from "../../keno-match-helper";
import { calculateTotalPoint } from "../../../../keno/keno.helper";
import { StateRound } from "../bet-history-hepler";
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
                <TeamScore teamName={translateMapping?.blue} score={blueScore} isWin={blueScore > redScore} customClassName={"blue"} />
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
                <TeamScore teamName={translateMapping?.red} score={redScore} isWin={redScore > blueScore} customClassName={"red"} />
            </div>

            <div className={Styles["winning-info"]}>
                {renderTextWinningForTeam({ settlementResult, translateMapping })}
                <div className={Styles["sum"]}> {translateMapping?.sum}</div>
                <div className={Styles["result-info"]}>{renderWinningInfo({ settlementResult, translateMapping })}</div>
            </div>
        </div>
    );
};

const renderTextWinningForTeam = ({ settlementResult, translateMapping }) => {
    const classFollowTeam = settlementResult?.tie ? Choices.tie : settlementResult?.blue ? Choices.blue : Choices.red;
    return (
        <div className={`${Styles["team-win"]} ${Styles[classFollowTeam]}`} data-testid="text-winning-info">
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
            })}
            {renderScoreRounds({
                result: fullTime?.result,
                stateRound: StateRound.ft,
                translateMapping,
                total: fullTime?.sum,
                settlementResult: fullTime?.settlementResult,
            })}
        </>
    );
};

export default RenderScoreDetailKenoMatch;
