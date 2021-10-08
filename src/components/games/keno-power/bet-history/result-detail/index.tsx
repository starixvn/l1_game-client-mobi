import React from "react";

import TeamResult from "../../../../keno/team-result";
import TeamScore from "../../../../keno/team-score";
import { renderTeamWinningInfo, renderTextWinningForTeam } from "../../../../keno/bet-history/result-detail";
import Styles from "../bet-history.module.scss";
import { sumArray } from "../../../../../helpers/number-helper";

const RenderScoreDetailKenoPower = ({ bet, translateMapping }) => {
    const { result, settlementResult } = bet;
    const { blue, red } = result;
    const blueScore = sumArray(blue);
    const redScore = sumArray(red);
    return (
        <div className={Styles["container-round"]} data-testid="score-round">
            <div className={Styles["container-blue"]}>
                <TeamResult result={blue} customizeClassName={"ticket-history"} />
                <TeamScore
                    isShowScore={true}
                    teamName={translateMapping?.blue}
                    score={blueScore}
                    isWin={blueScore > redScore}
                    customClassName={"blue"}
                />
            </div>
            <div>
                <div className={Styles["round-name"]}></div>
                <div className={Styles["total-match-section"]}>
                    {translateMapping?.sum} <div className={Styles["total"]}>{blueScore + redScore}</div>
                </div>
            </div>

            <div className={Styles["container-red"]}>
                <TeamResult result={red} customizeClassName={"ticket-history"} />
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
                        choices: ["big", "small", "odd", "even"],
                        choiceForClassBlue: ["even", "big"],
                    })}
                </div>
                <div className={Styles["text-section"]}>
                    <span className={Styles["text-blue"]}> {translateMapping.blue}</span>
                    <span className={Styles["text-red"]}> {translateMapping.red}</span>
                </div>
                <div className={Styles["result-info"]}>
                    {renderTeamWinningInfo({
                        settlementResult,
                        translateMapping,
                        choices: ["blueBig", "blueSmall", "redBig", "redSmall"],
                        choiceForClassBlue: ["blueBig", "redBig"],
                    })}
                </div>
            </div>
        </div>
    );
};

export default RenderScoreDetailKenoPower;
