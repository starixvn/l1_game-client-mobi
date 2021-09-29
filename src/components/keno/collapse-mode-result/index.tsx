import { useTranslation } from "next-i18next";
import React from "react";
import { useGameContext } from "../../../contexts/game-context/game-context";
import ProgressBar from "../progress-bar";
import styles from "./collapse-mode-result.module.scss";

interface Props {
    result: {
        blue: number[];
        red: number[];
    };
    isFirstHalf?: boolean;
    onProgressBarAnimationFinish?: Function;
    winningTeam: string;
    isShowTitle?: boolean;
    hasAnimation: boolean;
    totalBlueH1: number;
    totalRedH1: number;
}

export const CollapseModeResult: React.FC<Props> = ({
    result,
    isFirstHalf,
    onProgressBarAnimationFinish,
    winningTeam,
    isShowTitle,
    hasAnimation,
    totalBlueH1,
    totalRedH1,
}) => {
    const { gameSetting } = useGameContext();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());

    return (
        <div className={styles["result-collapse-mode"]}>
            <div className={styles["result-container"]}>
                {
                    <ProgressBar
                        {...{
                            result,
                            onFinishHandle: onProgressBarAnimationFinish,
                            isShowCollapse: true,
                            isShowProgressBarTitle: isShowTitle,
                            isFirstHalf,
                            hasAnimation,
                            totalBlueH1,
                            totalRedH1,
                        }}
                    />
                }
            </div>
            {winningTeam && <div className={styles["result-label"]}>{t(winningTeam)}</div>}
        </div>
    );
};
