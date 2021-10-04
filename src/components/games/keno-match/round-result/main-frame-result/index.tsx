import { useTranslation } from "next-i18next";
import React from "react";

import { useGameContext } from "../../../../../contexts/game-context/game-context";
import TeamResult from "../../../../keno/team-result";
import TeamScore from "../../../../keno/team-score";
import MainFrameResultProps, { HalfRoundResultProps } from "./type";
import Styles from "./main-frame-result.module.scss";
import { sumArray } from "../../../../../helpers/number-helper";

export default function MainFrameResult({ halfTimeResult, fullTimeResult, isShowH1Score, isShowFTScore }: MainFrameResultProps) {
    const totalBlueH1 = sumArray(halfTimeResult.blue);
    const totalRedH1 = sumArray(halfTimeResult.red);

    const totalBlueFT = totalBlueH1 + sumArray(fullTimeResult.blue);
    const totalRedFT = totalRedH1 + sumArray(fullTimeResult.red);

    const firstHalfProps = {
            result: halfTimeResult,
            isShowScore: isShowH1Score,
            isFirstHalf: true,
            totalBlue: totalBlueH1,
            totalRed: totalRedH1,
        },
        fullTimeProps = {
            result: fullTimeResult,
            isShowScore: isShowFTScore,
            isFirstHalf: false,
            totalBlue: totalBlueFT,
            totalRed: totalRedFT,
        };

    return (
        <div className={Styles["main-result"]}>
            <HalfRoundResult {...firstHalfProps} />
            <HalfRoundResult {...fullTimeProps} />
        </div>
    );
}

export const HalfRoundResult = ({ result, isFirstHalf, totalBlue, totalRed, isShowScore }: HalfRoundResultProps) => {
    const { gameSetting } = useGameContext();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());

    return (
        <div className={Styles.result} data-testid="half-round-result-component">
            <div className={Styles["main-content"]}>
                <div className={Styles["team"]}>
                    <TeamResult result={result.blue} />
                    <TeamScore
                        teamName={t("blue")}
                        score={totalBlue}
                        isWin={isShowScore && totalBlue > totalRed}
                        customClassName={"blue"}
                        isShowScore={isShowScore}
                    />
                </div>
                <MiddleColum
                    totalScore={totalBlue + totalRed}
                    headerText={t(isFirstHalf ? "firstHalf" : "fullTime")}
                    isShowScore={isShowScore}
                />
                <div className={Styles["team"]}>
                    <TeamResult result={result.red} />
                    <TeamScore
                        teamName={t("red")}
                        score={totalRed}
                        isWin={isShowScore && totalRed > totalBlue}
                        customClassName={"red"}
                        isShowScore={isShowScore}
                    />
                </div>
            </div>
        </div>
    );
};

export const MiddleColum = ({ totalScore, headerText, isShowScore }) => {
    const { gameSetting } = useGameContext();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());
    return (
        <div className={Styles["middle-column"]}>
            <div className={Styles["header"]}>{headerText}</div>
            <div className={Styles["score-wrapper"]}>
                {t("sum")} <div className={Styles["score"]}>{isShowScore ? totalScore : ""}</div>
            </div>
        </div>
    );
};
