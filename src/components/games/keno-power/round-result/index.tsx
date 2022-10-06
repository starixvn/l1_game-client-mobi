import React from "react";
import { useTranslation } from "next-i18next";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import { sumArray } from "../../../../helpers/number-helper";
import ProgressBar from "../../../keno/progress-bar";
import TeamResult from "../../../keno/team-result";
import TeamScore from "../../../keno/team-score";
import { GameState } from "../../../shared/game-base/type";
import { Result } from "../keno-power";
import styles from "./round-result.module.scss";

export const RoundResult: React.FC<{ result: Result; gameState: GameState; isCollapse?: boolean; playResultAnimation?: boolean }> = ({
    result,
    gameState,
    isCollapse,
    playResultAnimation,
}) => {
    const { gameSetting } = useGameContext();
    const gameName = gameSetting.gameName.toLowerCase();
    const totalBlue = sumArray(result.blue);
    const totalRed = sumArray(result.red);

    const { t } = useTranslation(gameName);
    const isShowResult = gameState === GameState.DisplayResult;

    const renderFullModeResult = () => (
        <div className={`${styles["main-result"]} ${isShowResult ? styles["result-animation"] : ""} ${styles[gameName]}`}>
            <div className={styles["main-content"]}>
                <div className={styles["blue-team"]}>
                    <TeamResult result={result.blue} hasAnimation={gameState === GameState.DisplayResult} />
                    {!isShowResult && (
                        <TeamScore
                            isShowScore={totalBlue !== 0}
                            teamName={t("blue")}
                            score={totalBlue}
                            isWin={totalBlue > totalRed}
                            customClassName={"blue"}
                        />
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
                    {!isShowResult && (
                        <TeamScore
                            isShowScore={totalRed !== 0}
                            teamName={t("red")}
                            score={totalRed}
                            isWin={totalBlue < totalRed}
                            customClassName={"red"}
                        />
                    )}
                </div>
            </div>

            {isShowResult && playResultAnimation && <ProgressBar result={result} hasAnimation={true} />}
        </div>
    );

    return <>{isCollapse ? <ProgressBar result={result} hasAnimation={true} isShowCollapse={true} /> : renderFullModeResult()}</>;
};
