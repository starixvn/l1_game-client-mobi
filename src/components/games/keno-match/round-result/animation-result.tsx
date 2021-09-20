import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import { HalfRoundAnimationResultProps, TeamWithAnimationProps, AnimationResultProps } from "./main-frame-result-props";
import { calculateTotalPoint } from "../keno-match-helper";
import { Tie } from ".";
import Styles from "./animation-result.module.scss";
import { buildHalfMatchProps } from "../keno-match-helper";

const AnimationResult = ({
    halfTimeResult,
    fullTimeResult,
    isActiveLiveFullTime,
    gameName,
    playResultAnimation
}: AnimationResultProps) => {
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

        if (playResultAnimation) {
            timerId = setInterval(doAnimation, 250);
        } else {
            if (isActiveLiveFullTime) {
                setResultProps({
                    ...{
                        result: fullTimeResult,
                        active: isActiveLiveFullTime,
                        gameName,
                    },
                    ...buildHalfMatchProps(true),
                });
            } else {
                setResultProps({
                    ...{
                        result: halfTimeResult,
                        active: !isActiveLiveFullTime,
                        gameName,
                    },
                    ...buildHalfMatchProps(false),
                });
            }
        }
        return () => {
            clearInterval(timerId);
        };
    }, [halfTimeResult, fullTimeResult, playResultAnimation]);

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
        },
        totalPoint = blueTeamProps.total + redTeamProps.total;

    const totalRedScoreStyle = {
            "--red-score-prev": redTeamProps.total - result.red[result.red.length - 1],
            "--red-score": redTeamProps.total,
            "--total-score": totalPoint,
            "--total-score-prev": totalPoint - result.red[result.red.length - 1] - result.blue[result.blue.length - 1],
        } as React.CSSProperties,
        totalBlueScoreStyle = {
            "--blue-score-prev": blueTeamProps.total - result.blue[result.blue.length - 1],
            "--blue-score": blueTeamProps.total,
            "--total-score": totalPoint,
            "--total-score-prev": totalPoint - result.red[result.red.length - 1] - result.blue[result.blue.length - 1],
        } as React.CSSProperties;

    const triangleWinningClass = redTeamProps.total > blueTeamProps.total ? "red" : "blue",
        triangleClass = `${Styles["triangle"]} ${Styles[triangleWinningClass]}`;

    return (
        <div className={`${classNames} ${Styles["open-result"]}`}>
            <div className={Styles["header"]}>{t(headerText)}</div>
            <div className={Styles["main-content"]}>
                <TeamWithAnimation result={blueTeamProps.result} />
                <TeamWithAnimation result={redTeamProps.result} />
            </div>
            <div className={Styles["progress-bar-team"]}>
                <div className={Styles["title"]}>
                    <div className={Styles["title-blue"]}>
                        <span className={Styles["text"]}>{t("blue")}:</span>
                        <span className={Styles["score"]}>{blueTeamProps.total}</span>
                    </div>
                    <div className={Styles["title-red"]}>
                        <span className={Styles["text"]}>{t("red")}:</span>
                        <span className={Styles["score"]}>{redTeamProps.total}</span>
                    </div>
                </div>
                <div className={`${Styles["progress-bar"]} ${Styles[progressBarStyle]}`}>
                    <div className={triangleClass} style={totalBlueScoreStyle}></div>
                    <div className={Styles["blue-team"]} style={totalBlueScoreStyle}></div>
                    <div className={Styles["sperate"]}>
                        <div className={Styles["total-score-match"]}>
                            {t("sum")} <div className={Styles["score-match"]}>{totalPoint}</div>
                        </div>
                    </div>
                    <div className={Styles["red-team"]} style={totalRedScoreStyle}></div>
                </div>
            </div>
        </div>
    );
};

export const TeamWithAnimation = ({ result }: { result: number[] }) => {
    return (
        <div className={`${Styles.team}`} data-testid="team-component">
            <div className={Styles.row} data-testid="team-result-row-component">
                {result.map((number: number, index: number) => (
                    <Tie key={index} number={number} />
                ))}
            </div>
        </div>
    );
};

export default AnimationResult;
