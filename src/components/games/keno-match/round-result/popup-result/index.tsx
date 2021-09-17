import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";

import MainFrameResultProps, { HalfRoundResultProps } from "../main-frame-result/main-frame-result-props";
import { SettlementResult } from "../../type";
import { calculateTotalPoint } from "../../keno-match-helper";
import { Tie } from "../main-frame-result";
import Styles from "../main-frame-result/main-frame-result.module.scss";
import { buildHalfMatchProps } from "../../keno-match-helper";

export interface HalfRoundResultPopupProps extends HalfRoundResultProps {
    settlementResult: SettlementResult;
    showSettlement: boolean;
    progressBarStyle: string;
}

export interface TeamWithAnimationProps {
    result: number[];
    teamName: string[];
    gameName: string;
    total: number;
}

const PopupResult = ({ halfTimeResult, fullTimeResult, isActiveLiveFullTime, gameName }: MainFrameResultProps) => {
    const emptyResult = { blue: [], red: [] };
    const [resultProps, setResultProps] = useState(null);
    const [fullTimeResultAnimation, setFullTimeResultAnimation] = useState(emptyResult);
    const [halfTimeResultAnimation, setHalfTimeResultAnimation] = useState(emptyResult);

    useEffect(() => {
        let index = 0;

        const timerId = setInterval(doAnimation, 200);

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

        

        return () => {
            clearInterval(timerId);
        };
    }, [halfTimeResult, fullTimeResult]);

    return <div className={Styles["popup-result"]}>{resultProps !== null && <HalfRoundResultPopup {...resultProps} />}</div>;
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

export const HalfRoundResultPopup = ({ result, active, className, headerText, gameName, progressBarStyle }: HalfRoundResultPopupProps) => {
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
            total: calculateTotalPoint(result.red)
        },
        totalPoint = blueTeamProps.total + redTeamProps.total;

    const totalRedScoreStyle = {
            "--red-score-prev": redTeamProps.total - result.red[result.red.length - 1],
            "--red-score": redTeamProps.total,
            "--total-score": totalPoint,
        } as React.CSSProperties,
        totalBlueScoreStyle = {
            "--blue-score-prev": blueTeamProps.total - result.blue[result.blue.length - 1],
            "--blue-score": blueTeamProps.total,
            "--total-score": totalPoint,
        } as React.CSSProperties;

    const triangleWinningClass = redTeamProps.total > blueTeamProps.total ? "red" : "blue",
        triangleClass = `${Styles["triangle"]} ${triangleWinningClass}`;

    return (
        <div className={`${classNames} ${Styles["open-result"]}`}>
            <div className={Styles["header"]}>{t(headerText)}</div>
            <div className={Styles["main-content"]}>
                <TeamWithAnimation result={blueTeamProps.result} />
                <TeamWithAnimation result={redTeamProps.result} />
            </div>
            <div className={Styles["progress-bar-team"]}>
                <div className={Styles["title"]}>
                    <span className={Styles["title-blue"]}>{t("blue")}</span>
                    <span className={Styles["title-red"]}>{t("red")}</span>
                </div>
                <div className={`${Styles["progress-bar"]} ${Styles[progressBarStyle]}`}>
                    <div className={triangleClass} style={totalBlueScoreStyle}></div>
                    <div className={Styles["blue-team"]} style={totalBlueScoreStyle}>
                        <span className={Styles["blue-score"]}>{blueTeamProps.total}</span>
                    </div>
                    <div className={Styles["sperate"]}>
                        <div className={Styles["total-score-match"]}>
                            {t("sum")} <div className={Styles["score-match"]}>{totalPoint}</div>
                        </div>
                    </div>
                    <div className={Styles["red-team"]} style={totalRedScoreStyle}>
                        <span className={Styles["red-score"]}>{redTeamProps.total}</span>
                    </div>
                </div>
            </div>                   
        </div>
    );
};

export default PopupResult;
