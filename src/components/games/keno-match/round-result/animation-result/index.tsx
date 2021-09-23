import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";

import TeamResult from "../../../../keno/team-result";
import { buildHalfMatchProps, calculateTotalPoint } from "../../keno-match-helper";
import MainFrameResultProps from "../main-frame-result/type";
import ProgressBar from "../progress-bar";
import Styles from "./animation-result.module.scss";
import { HalfRoundAnimationResultProps, TeamWithAnimationProps } from "./type";

const AnimationResult = ({ halfTimeResult, fullTimeResult, isActiveLiveFullTime, gameName }: MainFrameResultProps) => {
    const emptyResult = { blue: [], red: [] };
    const [resultProps, setResultProps] = useState(null);
    const [fullTimeResultAnimation, setFullTimeResultAnimation] = useState(emptyResult);
    const [halfTimeResultAnimation, setHalfTimeResultAnimation] = useState(emptyResult);

    useEffect(() => {
        let index = 0;
        let timerId = null;

        function doAnimation() {
            if (index === halfTimeResult.blue.length) {
                setFullTimeResultAnimation(emptyResult);
                setHalfTimeResultAnimation(emptyResult);
                clearInterval(timerId);
                return;
            }

            const progressBarStyle = `open-ball-${index + 1}`;

            if (isActiveLiveFullTime) {
                setFullTimeResultAnimation((prev) => {
                    prev.blue.push(fullTimeResult.blue[index]);
                    prev.red.push(fullTimeResult.red[index]);

                    return prev;
                });

                setResultProps({
                    ...{
                        result: fullTimeResultAnimation,
                        active: isActiveLiveFullTime,
                        gameName,
                        progressBarStyle,
                    },
                    ...buildHalfMatchProps(true),
                });
            } else {
                setHalfTimeResultAnimation((prev) => {
                    prev.blue.push(halfTimeResult.blue[index]);
                    prev.red.push(halfTimeResult.red[index]);

                    return prev;
                });

                setResultProps({
                    ...{
                        result: halfTimeResultAnimation,
                        active: !isActiveLiveFullTime,
                        gameName,
                        progressBarStyle,
                    },
                    ...buildHalfMatchProps(false),
                });
            }

            index++;
        }

        setTimeout(() => {
            timerId = setInterval(doAnimation, 200);
        }, 200);

        return () => {
            clearInterval(timerId);
        };
    }, [halfTimeResult, fullTimeResult]);

    return <div className={Styles["popup-result"]}>{resultProps !== null && <HalfRoundAnimationResult {...resultProps} />}</div>;
};

export const HalfRoundAnimationResult = ({
    result,
    active,
    className,
    headerText,
    gameName,
    progressBarStyle,
}: HalfRoundAnimationResultProps) => {
    const classNames = `${Styles.result} ${className} ${active ? Styles.active : ""}`,
        { t } = useTranslation(gameName),
        blueTeamProps: TeamWithAnimationProps = {
            result: result.blue,
            teamName: t("blue"),
            gameName,
            total: calculateTotalPoint(result.blue),
        },
        redTeamProps: TeamWithAnimationProps = {
            result: result.red,
            teamName: t("red"),
            gameName,
            total: calculateTotalPoint(result.red),
        };

    return (
        <div className={`${classNames} ${Styles["open-result"]}`}>
            <div className={Styles["header"]}>{t(headerText)}</div>
            <div className={Styles["main-content"]}>
                <TeamResult result={blueTeamProps.result} hasAnimation />
                <TeamResult result={redTeamProps.result} hasAnimation />
            </div>
            <ProgressBar totalBlue={blueTeamProps.total} totalRed={redTeamProps.total} />
        </div>
    );
};

export default AnimationResult;
