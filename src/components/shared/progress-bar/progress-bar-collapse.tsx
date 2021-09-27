import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useGameContext } from "../../../contexts/game-context/game-context";
import Styles from "./progress-bar.module.scss";

type Props = {
    totalBlue: number;
    totalRed: number;
    isFirstHalf: boolean;
};

export default function ProgressBarCollapse({ totalBlue, totalRed, isFirstHalf }: Props) {
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

    return (
        <div className={Styles["popup-result"]}>
            <div className={`${Styles.result} ${Styles["open-result"]}`}>
                <div className={Styles["progress-bar-team"]}>
                    <div className={`${Styles["progress-bar"]}`}>
                        <div className={`${Styles["triangle"]} ${Styles[winningTeam]}`} style={inlineStyles}></div>
                        <div className={Styles["blue-team"]} style={inlineStyles}></div>
                        <div className={Styles["sperate"]}>
                            <div className={Styles["total-score-match"]}>
                                <span className={Styles["text"]}>{t(isFirstHalf ? "firstHalf" : "fullTime")}</span>
                            </div>
                        </div>
                    </div>
                    <div>{t(winningTeam)}</div>
                </div>
            </div>
        </div>
    );
}
