import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useGameContext } from "../../../contexts/game-context/game-context";
import Styles from "./progress-bar.module.scss";

interface Props {
    totalBlue: number;
    totalRed: number;
    isShowCollapse: boolean;
    isFirstHalf: boolean;
}

interface ProgressBarFullModeProps {
    totalBlue: number;
    totalRed: number;
    winningTeam: string;
    inlineStyles: React.CSSProperties;
    t: any;
}

interface ProgressBarCollapseModeProps extends ProgressBarFullModeProps {
    isFirstHalf: boolean;
}

export default function ProgressBar({ totalBlue, totalRed, isShowCollapse, isFirstHalf }: Props) {
    const { gameSetting } = useGameContext();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());
    const [width, setWidth] = useState<number>(50);
    const [winningTeam, setWinningTeam] = useState<string>("draw");

    useEffect(() => {
        const percent = parseFloat(((totalBlue * 100) / (totalBlue + totalRed)).toFixed(2));
        if (percent > 50) {
            setWinningTeam("blue");
        } else if (percent < 50) {
            setWinningTeam("red");
        } else {
            setWinningTeam("draw");
        }

        setWidth(percent);
    }, [totalBlue, totalRed]);

    const inlineStyles = {
        "--width": `${width}%`,
    } as React.CSSProperties;

    return isShowCollapse ? (
        <ProgressBarCollapseMode {...{ totalBlue, totalRed, winningTeam, inlineStyles, t, isFirstHalf }} />
    ) : (
        <ProgressBarFullMode {...{ totalBlue, totalRed, winningTeam, inlineStyles, t }} />
    );
}

const ProgressBarFullMode = ({ totalBlue, totalRed, winningTeam, inlineStyles, t }: ProgressBarFullModeProps) => {
    return (
        <div className={Styles["progress-bar-team"]}>
            <div className={Styles["title"]}>
                <div className={Styles["title-blue"]}>
                    <span className={Styles["text"]}>{t("blue")}:</span>
                    <span className={Styles["score"]}>{totalBlue}</span>
                </div>
                <div className={Styles["title-red"]}>
                    <span className={Styles["text"]}>{t("red")}:</span>
                    <span className={Styles["score"]}>{totalRed}</span>
                </div>
            </div>
            <div className={`${Styles["progress-bar"]}`}>
                <div className={`${Styles["triangle"]} ${Styles[winningTeam]}`} style={inlineStyles}></div>
                <div className={Styles["blue-team"]} style={inlineStyles}></div>
                <div className={Styles["sperate"]}>
                    <div className={Styles["total-score-match"]}>
                        <span className={Styles["text"]}>{t("sum")}</span>
                        <div className={Styles["score-match"]}>{totalBlue + totalRed}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProgressBarCollapseMode = ({totalBlue, totalRed, isFirstHalf, winningTeam, inlineStyles, t }: ProgressBarCollapseModeProps) => {
    return (
        <div className={`${Styles["progress-bar-team"]} ${Styles["progress-bar-collapse"]}`}>
        <div className={`${Styles["progress-bar"]}`}>
            <div className={`${Styles["triangle"]} ${Styles[winningTeam]}`} style={inlineStyles}></div>
            <div className={Styles["blue-team"]} style={inlineStyles}></div>
            <div className={Styles["sperate"]}>
                <div className={Styles["total-score-match"]}>
                    <span className={Styles["text"]}>{t(isFirstHalf ? "firstHalf" : "fullTime")}</span>
                </div>
            </div>
        </div>
    </div>
    );
};
