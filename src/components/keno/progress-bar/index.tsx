import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useGameContext } from "../../../contexts/game-context/game-context";
import Styles from "./progress-bar.module.scss";

interface Props {
    result: {
        blue: number[];
        red: number[];
    };
    isShowCollapse?: boolean;
    isFirstHalf?: boolean;
    onFinishHandle?: Function;
    isShowProgressBarTitle?: boolean;
}

interface ProgressBarFullModeProps {
    totalBlue: number;
    totalRed: number;
    winningTeam: string;
    inlineStyles: React.CSSProperties;
    t: any;
}

interface ProgressBarCollapseModeProps {
    totalBlue: number;
    totalRed: number;
    isFirstHalf: boolean;
    winningTeam: string;
    inlineStyles: React.CSSProperties;
    t: any;
    isShowProgressBarTitle?: boolean;
}

export default function ProgressBar({ result, isShowCollapse, isFirstHalf, onFinishHandle, isShowProgressBarTitle }: Props) {
    const { gameSetting } = useGameContext();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());
    const [width, setWidth] = useState<number>(50);
    const [winningTeam, setWinningTeam] = useState<string>("draw");
    const [totalBlue, setTotalBlue] = useState<number>(0);
    const [totalRed, setTotalRed] = useState<number>(0);
    let interval: NodeJS.Timer = null;
    let percent = 50;

    useEffect(() => {
        let index = 0;
        let currentTotalRed = 0;
        let currentTotalBlue = 0;

        interval = setInterval(() => {
            if (index === result.blue.length) {
                onFinishHandle && onFinishHandle();
                clearInterval(interval);
            } else {
                currentTotalBlue += result.blue[index];
                currentTotalRed += result.red[index];
                setTotalBlue(currentTotalBlue);
                setTotalRed(currentTotalRed);
                percent = parseFloat(((currentTotalBlue * 100) / (currentTotalBlue + currentTotalRed)).toFixed(2));

                setWidth(percent);
                percent > 50 && setWinningTeam("blue");
                percent < 50 && setWinningTeam("red");
                percent === 50 && setWinningTeam("draw");
                index++;
            }
        }, 100);

        return () => {
            interval && clearInterval(interval);
        };
    }, []);

    const inlineStyles = {
        "--width": `${width}%`,
    } as React.CSSProperties;

    return isShowCollapse ? (
        <ProgressBarCollapseMode {...{ totalBlue, totalRed, winningTeam, inlineStyles, t, isFirstHalf, isShowProgressBarTitle }} />
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

const ProgressBarCollapseMode = ({
    totalBlue,
    totalRed,
    isFirstHalf,
    winningTeam,
    inlineStyles,
    t,
    isShowProgressBarTitle,
}: ProgressBarCollapseModeProps) => {
    return (
        <>
            <div className={Styles["progress-extra"]}>
                <div className={Styles["score-blue"]}>{totalBlue}</div>
                <div className={Styles["score-red"]}>{totalRed}</div>
            </div>
            <div className={`${Styles["progress-bar-team"]} ${Styles["progress-bar-collapse"]}`}>
                <div className={`${Styles["progress-bar"]}`}>
                    <div className={`${Styles["triangle"]} ${Styles[winningTeam]}`} style={inlineStyles}></div>
                    <div className={Styles["blue-team"]} style={inlineStyles}></div>
                    <div className={Styles["sperate"]}>
                        <div className={Styles["total-score-match"]}>
                            {isShowProgressBarTitle && <span className={Styles["text"]}>{t(isFirstHalf ? "firstHalf" : "fullTime")}</span>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
