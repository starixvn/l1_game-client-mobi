import { useTranslation } from "next-i18next";
import React from "react";

import { useGameContext } from "../../../../../contexts/game-context/game-context";
import TeamResult from "../../../../keno/team-result";
import { calculateTotalPoint } from "../../keno-match-helper";
import Styles from "./main-frame-result.module.scss";
import TeamScore from "./team-score";
import MainFrameResultProps, { HalfRoundResultProps } from "./type";

export default function MainFrameResult({ halfTimeResult, fullTimeResult }: MainFrameResultProps) {
    return (
        <div className={Styles["main-result"]}>
            <HalfRoundResult result={halfTimeResult} isFirstHalf={true} />
            <HalfRoundResult result={fullTimeResult} isFirstHalf={false} />
        </div>
    );
}

export function HalfRoundResult({ result, isFirstHalf }: HalfRoundResultProps) {
    const blueScore = calculateTotalPoint(result.blue);
    const redScore = calculateTotalPoint(result.red);

    return (
        <div className={Styles.result} data-testid="half-round-result-component">
            <div className={Styles["main-content"]}>
                <div className={Styles["team"]}>
                    <TeamResult result={result.blue} />
                    <TeamScore teamName="blue" score={blueScore} />
                </div>
                <MiddleColum totalScore={blueScore + redScore} isFirstHalf={isFirstHalf} />
                <div className={Styles["team"]}>
                    <TeamResult result={result.red} />
                    <TeamScore teamName="red" score={redScore} />
                </div>
                
            </div>
        </div>
    );
}

function MiddleColum({ totalScore, isFirstHalf }) {
    const { gameSetting } = useGameContext();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());
    return (
        <div className={Styles["middle-column"]}>
            <div className={Styles["header"]}>{t(isFirstHalf ? "firstHalf" : "fullTime")}</div>
            <div className={Styles["score-wrapper"]}>
                {t("total")} <div className={Styles["score"]}>{totalScore}</div>
            </div>
        </div>
    );
}
