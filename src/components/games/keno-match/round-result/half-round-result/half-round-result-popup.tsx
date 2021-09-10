import React from "react";
import { useTranslation } from "next-i18next";

import { HalfRoundResultPopupProps } from "./half-round-result-props";
import { SettlementResult } from "../../type";
import { calculateTotalPoint } from "../../keno-match-helper";
import { Tie } from ".";
import Styles from "./half-round-result.module.scss";

export interface TeamWithAnimationProps {
    result: number[];
    teamName: string[];
    gameName: string;
    total: number;
}


export const TeamWithAnimation = ({ result, gameName }: TeamWithAnimationProps) => {
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

export const HalfRoundResultPopup: React.FC<HalfRoundResultPopupProps> = ({
    result,
    settlementResult,
    active,
    className,
    headerText,
    gameName,
    showSettlement,
    progressBarStyle,
}: HalfRoundResultPopupProps) => {
    const classNames = `${Styles.result} ${className} ${active ? Styles.active : ""}`,
        { t } = useTranslation(gameName),
        blueTeamProps: TeamWithAnimationProps = {
            result: result?.blue,
            teamName: t("blue"),
            gameName,
            total: calculateTotalPoint(result.blue),
        },
        redTeamProps: TeamWithAnimationProps = {
            result: result?.red,
            teamName: t("red"),
            gameName,
            total: calculateTotalPoint(result.red),
        },
        totalPoint = blueTeamProps.total + redTeamProps.total;

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

    const totalRedScoreStyle = { "--red-score": redTeamProps.total, "--total-score": totalPoint } as React.CSSProperties,
        totalBlueScoreStyle = { "--blue-score": blueTeamProps.total, "--total-score": totalPoint } as React.CSSProperties,
        totalScoreStyle = { "--total-score": totalPoint } as React.CSSProperties;

    return (
        <div className={`${classNames} ${Styles["open-result"]}`}>
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
                        <span className={Styles["blue-score"]}>{blueTeamProps.total}</span>
                    </div>
                    <div className={Styles["sperate"]}></div>
                    <div className={Styles["red-team"]} style={totalRedScoreStyle}>
                        <span className={Styles["red-score"]}>{redTeamProps.total}</span>
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
