import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "next-i18next";

import { HalfRoundResultPopupProps } from "./half-round-result-props";
import { SettlementResult } from "../../type";
import { resetValue } from "../../keno-match-helper";
import Styles from "./half-round-result.module.scss";

interface TieWithAnimationProps {
    value: number;
    index: number;
    gameName: string;
}

export interface TeamWithAnimationProps {
    result: number[];
    teamName: string[];
    gameName: string;
}

export const TieWithAnimation = ({ value, index, gameName }: TieWithAnimationProps) => {
    return (
        <div className={`${Styles["hidden"]} ${Styles["number"]} ${`${gameName}ball-${index}`}`} data-testid="tie-component">
            {value !== resetValue ? value : ""}
        </div>
    );
};

export const TeamWithAnimation = ({ result, gameName }: TeamWithAnimationProps) => {
    return (
        <div className={`${Styles.team}`} data-testid="team-component">
            <div className={Styles.row} data-testid="team-result-row-component">
                {result.map((number: number, index: number) => (
                    <TieWithAnimation key={index} value={number} index={index} gameName={gameName} />
                ))}
            </div>
        </div>
    );
};

export const HalfRoundResultPopup: React.FC<HalfRoundResultPopupProps> = ({
    result,
    settlementResult,
    active,
    className,
    headerText,
    gameName,
}: HalfRoundResultPopupProps) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [progressBarStyle, setProgressBarStyle] = useState("");
    const [totalPointBlue, setTotalPointBlue] = useState(0);
    const [totalPointRed, setTotalPointRed] = useState(0);
    const [totalPoint, setTotalPoint] = useState(0);
    const [showSettlement, setShowSettlement] = useState(false);
    const classNames = `${Styles.result} ${className} ${active ? Styles.active : ""}`,
        { t } = useTranslation(gameName),
        blueTeamProps: TeamWithAnimationProps = {
            result: result.blue,
            teamName: t("blue"),
            gameName,
        },
        redTeamProps: TeamWithAnimationProps = {
            result: result.red,
            teamName: t("red"),
            gameName,
        };

    const buildWinning = (settlementResult: SettlementResult) => {
        if (settlementResult === undefined) {
            return <></>;
        }

        return Object.keys(settlementResult).map((keyName, index) => {
            if (settlementResult[keyName] && ["odd", "even", "over", "under"].includes(keyName)) {
                return (
                    <div key={index} className={Styles["result-info-red"]}>
                        {t(keyName)}
                    </div>
                );
            }
        });
    };

    useEffect(() => {
        let index = 0;
        setProgressBarStyle("");

        function doAnimation() {
            if (index === blueTeamProps.result.length) {
                setShowSettlement(true);
                clearInterval(timerId);
                return;
            }

            setTotalPointBlue((prev) => prev + blueTeamProps.result[index]);
            setTotalPointRed((prev) => prev + redTeamProps.result[index]);
            setTotalPoint((prev) => prev + redTeamProps.result[index] + +blueTeamProps.result[index]);

            const animationClass = `${gameName}ball-${index}`;
            document.getElementsByClassName(animationClass)[0].classList.remove(Styles["hidden"]);
            document.getElementsByClassName(animationClass)[1].classList.remove(Styles["hidden"]);
            setProgressBarStyle(`${Styles[`open-ball-${index + 1}`]}`);
            // setTimeout(() => {
            //     setProgressBarStyle((prev) => `${prev} ${`open-ball-${index + 1}`}`);
            // }, 100);
            index++;
        }

        const timerId = setInterval(doAnimation, 400);

        return () => {
            clearInterval(timerId);
        };
    }, [result]);

    const totalRedScoreStyle = { "--red-score": totalPointRed, "--total-score": totalPoint } as React.CSSProperties,
    totalBlueScoreStyle = { "--blue-score": totalPointBlue, "--total-score": totalPoint } as React.CSSProperties,
    totalScoreStyle = { "--total-score": totalPoint } as React.CSSProperties;

    return (
        <div ref={wrapperRef} className={`${classNames} ${Styles["open-result"]}`}>
            <div className={Styles["header"]}>{t(headerText)}</div>
            <div className={Styles["main-content"]}>
                <TeamWithAnimation {...blueTeamProps} />
                <TeamWithAnimation {...redTeamProps} />
            </div>
            <div className={Styles["progress-bar-team"]}>
                <div className={Styles["title"]}>
                    <span className={Styles["title-blue"]}>{t("blue")}</span>
                    <span className={Styles["title-red"]}>{t("red")}</span>
                </div>
                <div className={`${Styles["progress-bar"]} ${progressBarStyle}`}>
                    <div className={Styles["triangle"]}></div>
                    <div className={Styles["blue-team"]} style={totalBlueScoreStyle}>
                        <span className={Styles["blue-score"]}>{totalPointBlue}</span>
                    </div>
                    <div className={Styles["sperate"]}></div>
                    <div className={Styles["red-team"]} style={totalRedScoreStyle}>
                        <span className={Styles["red-score"]}>{totalPointRed}</span>
                    </div>
                </div>
            </div>
            <div className={Styles["label-total"]}>{t("sum")} </div>
            <div className={Styles["total-section"]}>
                {showSettlement && <div className={Styles["result-info"]}>{buildWinning(settlementResult)}</div>}
                <div className={Styles["total-score-match"]} style={totalScoreStyle}>
                    {t("total")} <div className={Styles["score-match"]}>{totalPoint}</div>
                </div>
            </div>
        </div>
    );
};
