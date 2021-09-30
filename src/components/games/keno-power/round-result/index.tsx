import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGameContext } from "../../../../contexts/game-context/game-context";
import { sumArray } from "../../../../helpers/number-helper";
import { CollapseModeResult } from "../../../keno/collapse-mode-result";
import ProgressBar from "../../../keno/progress-bar";
import TeamResult from "../../../keno/team-result";
import TeamScore from "../../../keno/team-score";
import { GameState } from "../../../shared/game-base/type";
import { Result } from "../keno-power";
import styles from "./round-result.module.scss";

export const RoundResult: React.FC<{ result: Result; gameState: GameState; isCollapse?: boolean }> = ({
    result,
    gameState,
    isCollapse,
}) => {
    const { gameSetting } = useGameContext();
    const totalBlue = sumArray(result.blue);
    const totalRed = sumArray(result.red);
    const winningTeam = totalBlue > totalRed ? "blue" : "red";

    const { t } = useTranslation(gameSetting.gameName.toLowerCase());
    const isShowResult = gameState === GameState.DisplayResult;

    const renderFullModeResult = () => (
        <div className={styles["main-result"]}>
            <div className={styles["blue-team"]}>
                <TeamResult result={result.blue} hasAnimation={gameState === GameState.DisplayResult} />
                {!isShowResult && (
                    <TeamScore teamName={t("blue")} score={totalBlue} isWin={totalBlue > totalRed} customClassName={"blue"} />
                )}
            </div>

            {!isShowResult && (
                <div className={styles["middle-column"]}>
                    <div className={styles["score-wrapper"]}>
                        {t("sum")} <div className={styles["score"]}>{totalBlue + totalRed}</div>
                    </div>
                </div>
            )}

            <div className={styles["red-team"]}>
                <TeamResult result={result.red} hasAnimation={gameState === GameState.DisplayResult} />
                {!isShowResult && <TeamScore teamName={t("red")} score={totalRed} isWin={totalBlue < totalRed} customClassName={"red"} />}
            </div>

            {isShowResult && <ProgressBar result={result} hasAnimation={true} />}
        </div>
    );

    return (
        <>{isCollapse ? <CollapseModeResult hasAnimation={true} winningTeam={winningTeam} result={result} /> : renderFullModeResult()}</>
    );
};
