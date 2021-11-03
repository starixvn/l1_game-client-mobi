import React from "react";

import { StateRound } from "../bet-history-helper";
import { TeamResultInfo, WinningInfo } from "../../../../keno/bet-history/result-detail";
import { sumArray } from "../../../../../helpers/number-helper";
import Styles from "../bet-history.module.scss";

const renderScoreRounds = ({ result, settlementResult, stateRound, translateMapping, total, isFullTime, resultFH }) => {
    const { blue, red } = result;
    const blueScore = isFullTime ? sumArray(blue) + sumArray(resultFH?.blue ?? []) : sumArray(blue);
    const redScore = isFullTime ? sumArray(red) + sumArray(resultFH?.red ?? []) : sumArray(red);
    return (
        <div className={Styles["container-round"]} data-testid="score-round">
            <TeamResultInfo
                result={blue}
                translateMapping={translateMapping}
                score={blueScore}
                teamName={"blue"}
                isWin={blueScore > redScore}
            />

            <div>
                <div className={Styles["round-name"]}>
                    {stateRound === StateRound.ft ? translateMapping?.fullTime : translateMapping.firstHalf}
                </div>
                <div className={Styles["total-match-section"]}>
                    {translateMapping?.sum}
                    <div className={Styles["total"]}>{total}</div>
                </div>
            </div>
            <TeamResultInfo
                result={red}
                translateMapping={translateMapping}
                score={redScore}
                teamName={"red"}
                isWin={redScore > blueScore}
            />
            <WinningInfo
                settlementResult={settlementResult}
                translateMapping={translateMapping}
                choices={["over", "under", "odd", "even"]}
                choiceClassExtend={["over", "even"]}
            />
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
