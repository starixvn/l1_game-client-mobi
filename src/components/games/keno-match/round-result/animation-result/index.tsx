import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";

import { useGameContext } from "../../../../../contexts/game-context/game-context";
import ProgressBar from "../../../../keno/progress-bar";
import TeamResult from "../../../../keno/team-result";
import { Result } from "../../type";
import Styles from "./animation-result.module.scss";

type Props = {
    result: Result;
    isFirstHalf: boolean;
    isShowCollapse?: boolean;
};

export const AnimationResult = ({ result, isFirstHalf, isShowCollapse = false }: Props) => {
    const { gameSetting, playResultAnimation } = useGameContext();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());
    const [index, setIndex] = useState<number>(0);
    const [totalBlue, setTotalBlue] = useState<number>(0);
    const [totalRed, setTotalRed] = useState<number>(0);
    const [showWinningTeam, setShowWinningTeam] = useState<boolean>(false);

    useEffect(() => {
        const interval = setInterval(() => {
            if (index === result.blue.length) {
                setShowWinningTeam(true);
                clearInterval(interval);
                return;
            }

            setTotalBlue(totalBlue + result.blue[index]);
            setTotalRed(totalRed + result.red[index]);

            setIndex(index + 1);
        }, 100);

        return () => {
            clearInterval(interval);
        };
    });
    const progressBar = <ProgressBar {...{ totalBlue, totalRed, isFirstHalf, isShowCollapse }} />;
    const winningTeam = totalBlue > totalRed ? "blue" : "red";

    return isShowCollapse ? (
        <div className={Styles["result-collapse-mode"]}>
            <div className={Styles["result-container"]}>
                <div className={Styles["progress-extra"]}>
                    <div className={Styles["score-red"]}>{totalRed}</div>
                    <div className={Styles["score-blue"]}>{totalBlue}</div>
                </div>
                {progressBar}
            </div>
          {  showWinningTeam && <div className={Styles["result-label"]}>{t(winningTeam)}</div> }
        </div>
    ) : (
        <div className={Styles["popup-result"]}>
            <div className={`${Styles.result} ${Styles["open-result"]}`}>
                <div className={Styles["header"]}>{t(isFirstHalf ? "firstHalf" : "fullTime")}</div>
                <div className={Styles["main-content"]}>
                    <TeamResult result={result.blue} hasAnimation={playResultAnimation} />
                    <TeamResult result={result.red} hasAnimation={playResultAnimation} />
                </div>
                {progressBar}
            </div>
        </div>
    );
};

export default AnimationResult;
