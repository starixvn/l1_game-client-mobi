import { useTranslation } from "next-i18next";
import React from "react";
import { useGameContext } from "../../../contexts/game-context/game-context";
import ProgressBar from "../progress-bar";
import styles from "./collapse-mode-result.module.scss";

export const CollapseModeResult = ({ result, onProgressBarAnimationFinish, winningTeam, isShowTitle }) => {
    const { gameSetting } = useGameContext();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());

    return (
        <div className={styles["result-collapse-mode"]}>
            <div className={styles["result-container"]}>
                {
                    <ProgressBar
                        result={result}
                        onFinishHandle={onProgressBarAnimationFinish}
                        isShowCollapse={true}
                        isShowProgressBarTitle={isShowTitle}
                    />
                }
            </div>
            {winningTeam && <div className={styles["result-label"]}>{t(winningTeam)}</div>}
        </div>
    );
};
