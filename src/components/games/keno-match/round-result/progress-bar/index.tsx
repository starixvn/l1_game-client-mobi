import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useGameContext } from "../../../../../contexts/game-context/game-context";
import Styles from "./progress-bar.module.scss";

type Props = {
    totalBlue: number;
    totalRed: number;
};
export default function ProgressBar({ totalBlue, totalRed }: Props) {
    const { gameSetting } = useGameContext();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());
    const [width, setWidth] = useState<number>(50);
    const [triangleClass, setTriangleClass] = useState<string>("draw");

    useEffect(() => {
        const percent = Math.floor((totalBlue * 100) / (totalBlue + totalRed));
        if (percent > 50) {
            setTriangleClass("blue");
        } else if (percent < 50) {
            setTriangleClass("red");
        } else {
            setTriangleClass("draw");
        }

        setWidth(percent);
    }, [totalBlue, totalRed]);

    console.log(width);
    const inlineStyles = {
        "--width": `${width}%`,
    } as React.CSSProperties;

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
                <div className={`${Styles["triangle"]} ${Styles[triangleClass]}`} style={inlineStyles}></div>
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
}
