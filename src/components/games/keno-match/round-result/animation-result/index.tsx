import { useTranslation } from "next-i18next";
import React, { useState } from "react";
import { useGameContext } from "../../../../../contexts/game-context/game-context";
import { sumArray } from "../../../../../helpers/number-helper";
import { CollapseModeResult } from "../../../../keno/collapse-mode-result";
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
    const [winningTeam, setWinningTeam] = useState<string>("");
    const totalBlue = sumArray(result.blue);
    const totalRed = sumArray(result.red);
    const detectWinningTeam = () => {
        setWinningTeam(totalBlue > totalRed ? "blue" : "red");
    };

    return isShowCollapse ? (
        <CollapseModeResult result={result} winningTeam={winningTeam} onProgressBarAnimationFinish={detectWinningTeam} isShowTitle={true} />
    ) : (
        <div className={Styles["popup-result"]}>
            <div className={`${Styles.result} ${Styles["open-result"]}`}>
                <div className={Styles["header"]}>{t(isFirstHalf ? "firstHalf" : "fullTime")}</div>
                <div className={Styles["main-content"]}>
                    <TeamResult result={result.blue} hasAnimation={playResultAnimation} />
                    <TeamResult result={result.red} hasAnimation={playResultAnimation} />
                </div>
                <ProgressBar {...{ result, isFirstHalf, onFinishHandle: detectWinningTeam }} />
            </div>
        </div>
    );
};

export default AnimationResult;
