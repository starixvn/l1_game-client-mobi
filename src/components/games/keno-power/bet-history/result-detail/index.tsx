import React from "react";

import { Choices } from "../../keno-power-helper";
import TeamResult from "../../../../keno/team-result";
import TeamScore from "../../../../keno/team-score";
import { calculateTotalPoint } from "../../../../keno/keno.helper";
import Styles from "../bet-history.module.scss";

const renderScoreRounds = ({ result, settlementResult, translateMapping }) => {
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
                <div className={Styles["total-match-section"]}>{translateMapping?.sum}</div>
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
        <div className={`${Styles["team-win"]} ${Styles[classFollowTeam]}`}>
            {settlementResult?.tie ? translateMapping.tie : settlementResult?.blue ? translateMapping.blueWin : translateMapping.redWin}
        </div>
    );
};

const renderWinningInfo = ({ settlementResult, translateMapping }) => {
    return "";
};

const RenderScoreDetailKenoPower = ({ bet, translateMapping }) => {
    const { result, settlementResult } = bet;
    return (
        <>
            {renderScoreRounds({
                result: result,
                translateMapping,
                settlementResult: settlementResult,
            })}
        </>
    );
};

export default RenderScoreDetailKenoPower;
