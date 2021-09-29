import React from "react";

import { Choices } from "../../keno-power-helper";
import TeamResult from "../../../../keno/team-result";
import TeamScore from "../../../../keno/team-score";
import { calculateTotalPoint } from "../../../../keno/keno.helper";
import { renderTeamWinningInfo } from "../../../../keno/bet-history/result-detail";
import Styles from "../bet-history.module.scss";

const renderTextWinningForTeam = ({ settlementResult, translateMapping }) => {
    const classFollowTeam = settlementResult?.tie ? Choices.tie : settlementResult?.blue ? Choices.blue : Choices.red;
    return (
        <div className={`${Styles["team-win"]} ${Styles[classFollowTeam]}`}>
            {settlementResult?.tie
                ? translateMapping.tie
                : settlementResult?.blue
                ? translateMapping.teamBlueWin
                : translateMapping.teamRedWin}
        </div>
    );
};

const RenderScoreDetailKenoPower = ({ bet, translateMapping }) => {
    const { result, settlementResult } = bet;
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
                <div className={Styles["round-name"]}></div>
                <div className={Styles["total-match-section"]}>
                    {translateMapping?.sum} <div className={Styles["total"]}>{blueScore + redScore}</div>
                </div>
            </div>

            <div className={Styles["container-red"]}>
                <TeamResult result={red} customClassName={"ticket-history"} />
                <TeamScore teamName={translateMapping?.red} score={redScore} isWin={redScore > blueScore} customClassName={"red"} />
            </div>

            <div className={Styles["winning-info"]}>
                {renderTextWinningForTeam({ settlementResult, translateMapping })}
                <div className={Styles["sum"]}> {translateMapping?.sum}</div>
                <div className={Styles["result-info"]}>
                    {renderTeamWinningInfo({
                        settlementResult,
                        translateMapping,
                        choices: ["odd", "even", "big", "small"],
                        choiceForClassBlue: ["even", "big"],
                    })}
                </div>
                <div>
                    <span className={Styles["text-blue"]}> {translateMapping.blue}</span>
                    <span className={Styles["text-red"]}> {translateMapping.red}</span>
                </div>
                <div className={Styles["result-info"]}>
                    {renderTeamWinningInfo({
                        settlementResult,
                        translateMapping,
                        choices: ["blueBig", "blueSmall", "redBig", "redSmall"],
                        choiceForClassBlue: ["blueBig", "blueSmall"],
                    })}
                </div>
            </div>
        </div>
    );
};

export default RenderScoreDetailKenoPower;
