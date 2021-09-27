import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";

import { useGameContext } from "../../../../../contexts/game-context/game-context";
import TeamResult from "../../../../keno/team-result";
import { Result } from "../../type";
import ProgressBar from "../../../../shared/progress-bar";
import Styles from "./animation-result.module.scss";

type Props = {
    result: Result;
    isFirstHalf: boolean;
};

export const AnimationResult = ({ result, isFirstHalf }: Props) => {
    const { gameSetting } = useGameContext();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());
    const [index, setIndex] = useState<number>(0);
    const [blueScore, setBlueScore] = useState<number>(0);
    const [redScore, setRedScore] = useState<number>(0);

    useEffect(() => {
        const interval = setInterval(() => {
            if (index === result.blue.length) {
                clearInterval(interval);
                return;
            }

            setBlueScore(blueScore + result.blue[index]);
            setRedScore(redScore + result.red[index]);

            setIndex(index + 1);
        }, 100);

        return () => {
            clearInterval(interval);
        };
    });

    return (
        <div className={Styles["popup-result"]}>
            <div className={`${Styles.result} ${Styles["open-result"]}`}>
                <div className={Styles["header"]}>{t(isFirstHalf ? "firstHalf" : "fullTime")}</div>
                <div className={Styles["main-content"]}>
                    <TeamResult result={result.blue} hasAnimation />
                    <TeamResult result={result.red} hasAnimation />
                </div>
                <ProgressBar totalBlue={blueScore} totalRed={redScore} />
            </div>
        </div>
    );
};

export default AnimationResult;
