import React from "react";

import { TeamResultInfo, WinningInfo, renderTeamWinningInfo } from "../../../../keno/bet-history/result-detail";
import { sumArray } from "../../../../../helpers/number-helper";
import Styles from "../bet-history.module.scss";

const RenderScoreDetailKenoPower = ({ bet, translateMapping }) => {
    const { result, settlementResult } = bet;
    const { blue, red } = result;
    const blueScore = sumArray(blue);
    const redScore = sumArray(red);
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
                <div className={Styles["round-name"]}></div>
                <div className={Styles["total-match-section"]}>
                    {translateMapping?.sum} <div className={Styles["total"]}>{blueScore + redScore}</div>
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
                choices={["big", "small", "odd", "even"]}
                choiceClassExtend={["even", "big"]}
            />

            <div className={Styles["winning-info-color"]}>
                <div className={Styles["text-section"]}>
                    <span className={Styles["text-blue"]}> {translateMapping.blue}</span>
                    <span className={Styles["text-red"]}> {translateMapping.red}</span>
                </div>
                <div className={Styles["result-info"]}>
                    {renderTeamWinningInfo({
                        settlementResult,
                        translateMapping,
                        choices: ["blueBig", "blueSmall", "redBig", "redSmall"],
                        choiceClassExtend: ["blueBig", "redBig"],
                    })}
                </div>
            </div>
        </div>
    );
};

export default RenderScoreDetailKenoPower;
