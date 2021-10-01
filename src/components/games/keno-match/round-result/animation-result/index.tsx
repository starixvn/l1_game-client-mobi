import { useTranslation } from "next-i18next";
import React, { useState, useEffect } from "react";
import { useGameContext } from "../../../../../contexts/game-context/game-context";
import { sumArray } from "../../../../../helpers/number-helper";
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

export const AnimationResult = ({
    halfTimeResultInline,
    fullTimeResultInline,
    isFirstHalf,
    playResultAnimation,
    isShowCollapse = false,
}: Props) => {
    const { gameSetting } = useGameContext();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());
    const result = isFirstHalf ? halfTimeResultInline : fullTimeResultInline;
    const [hasAnimation, setHasAnimation] = useState<boolean>(true);

    useEffect(() => {
        setHasAnimation(playResultAnimation);
    }, []);

    let totalBlueH1 = 0;
    let totalRedH1 = 0;

    if (!isFirstHalf) {
        totalBlueH1 = sumArray(halfTimeResultInline.blue);
        totalRedH1 = sumArray(halfTimeResultInline.red);
    }

    return isShowCollapse ? (
        <ProgressBar
            {...{
                result,
                isFirstHalf,
                hasAnimation,
                totalBlueH1,
                totalRedH1,
                isShowProgressBarTitle: true,
                isShowCollapse: true,
            }}
        />
    ) : (
        <div className={Styles["popup-result"]}>
            <div className={`${Styles.result} ${Styles["open-result"]}`}>
                <div className={Styles["header"]}>{t(isFirstHalf ? "firstHalf" : "fullTime")}</div>
                <div className={Styles["main-content"]}>
                    <TeamResult result={result.blue} hasAnimation={hasAnimation} />
                    <TeamResult result={result.red} hasAnimation={hasAnimation} />
                </div>
                <ProgressBar {...{ result, isFirstHalf, hasAnimation, totalBlueH1, totalRedH1 }} />
            </div>
        </div>
    );
};

export default AnimationResult;
