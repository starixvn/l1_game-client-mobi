import { useTranslation } from "next-i18next";
import React, { useState, useEffect } from "react";
import { useGameContext } from "../../../../../contexts/game-context/game-context";
import { sumArray } from "../../../../../helpers/number-helper";
import { CollapseModeResult } from "../../../../keno/collapse-mode-result";
import ProgressBar from "../../../../keno/progress-bar";
import TeamResult from "../../../../keno/team-result";
import { Result } from "../../type";
import Styles from "./animation-result.module.scss";

type Props = {
    halfTimeResultInline: Result;
    fullTimeResultInline: Result;
    isFirstHalf: boolean;
    playResultAnimation: boolean;
    isShowCollapse?: boolean;
};

export const AnimationResult = ({ halfTimeResultInline, fullTimeResultInline, isFirstHalf, playResultAnimation, isShowCollapse = false }: Props) => {
    const { gameSetting } = useGameContext();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());
    const [winningTeam, setWinningTeam] = useState<string>("");
    const result = isFirstHalf ? halfTimeResultInline : fullTimeResultInline;
    const [hasAnimation, setHasAnimation] = useState<boolean>(true);
  
    useEffect(() => {
        setHasAnimation(playResultAnimation);
    },[])

    let totalBlueH1 = 0;
    let totalRedH1 =  0;

    let totalBlue = 0;
    let totalRed = 0;
    
    if(isFirstHalf){
        totalBlue += sumArray(halfTimeResultInline.blue);
        totalRed += sumArray(halfTimeResultInline.red);
    }
    else{
        totalBlueH1 = sumArray(halfTimeResultInline.blue);
        totalRedH1 = sumArray(halfTimeResultInline.red);

        totalBlue += sumArray(fullTimeResultInline.blue);
        totalRed += sumArray(fullTimeResultInline.red);
    }

    const detectWinningTeam = () => {
        setWinningTeam(totalBlue > totalRed ? "blue" : "red");
    };
    
    return isShowCollapse ? (
        <CollapseModeResult {...{ result, isFirstHalf, winningTeam, onProgressBarAnimationFinish: detectWinningTeam, hasAnimation, totalBlueH1 , totalRedH1, isShowTitle: true}}/>
    ) : (
        <div className={Styles["popup-result"]}>
            <div className={`${Styles.result} ${Styles["open-result"]}`}>
                <div className={Styles["header"]}>{t(isFirstHalf ? "firstHalf" : "fullTime")}</div>
                <div className={Styles["main-content"]}>
                    <TeamResult result={result.blue} hasAnimation={hasAnimation} />
                    <TeamResult result={result.red} hasAnimation={hasAnimation} />
                </div>
                <ProgressBar {...{ result, isFirstHalf, onFinishHandle: detectWinningTeam, hasAnimation, totalBlueH1 , totalRedH1}} />
            </div>
        </div>
    );
};

export default AnimationResult;
