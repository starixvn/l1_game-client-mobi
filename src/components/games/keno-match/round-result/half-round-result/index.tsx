import React from "react";
import { useTranslation } from "next-i18next";

import { TeamProps, HalfRoundResultProps } from "./half-round-result-props";
import { resetValue, calculateTotalPoint } from "../../keno-match-helper";
import Styles from "./half-round-result.module.scss";

export function HalfRoundResult({ result, active, className, headerText, gameName }: HalfRoundResultProps) {
    const classNames = `${Styles.result} ${className} ${active ? Styles.active : ""}`,
        { t } = useTranslation(gameName),
        blueTeamProps: TeamProps = {
            result: result.blue,
            teamName: t("blue"),
        },
        redTeamProps: TeamProps = {
            result: result.red,
            teamName: t("red"),
        },
        totalPoint = calculateTotalPoint(result.blue) + calculateTotalPoint(result.red);

    return (
        <div className={classNames} data-testid="half-round-result-component">
            <div className={Styles["overlay"]}>
                <div className={Styles["blue"]}></div>
                <div></div>
                <div className={Styles["red"]}></div>
            </div>
            <div className={Styles["main-content"]}>
                <Team {...blueTeamProps} />
                <div className={Styles["middle-column"]}>
                    <div className={Styles.name}>{t(headerText)}</div>
                    <div className={Styles["score-wrapper"]}>
                        {t("total")} <div className={Styles["score"]}>{totalPoint}</div>
                    </div>
                </div>
                <Team {...redTeamProps} />
            </div>
        </div>
    );
}

export function Team({ result, teamName }: TeamProps) {
    return (
        <div className={`${Styles.team}`} data-testid="team-component">
            <div className={Styles.row} data-testid="team-result-row-component">
                {result.map((number: number, index: number) => (
                    <Tie key={index} number={number} />
                ))}
            </div>
            <div className={Styles["team-name"]}>
                <span className={Styles["name"]}>{teamName}:</span>
                <span className={Styles["score"]}>{calculateTotalPoint(result)}</span>
            </div>
        </div>
    );
}

export function Tie({ number }: { number: number }) {
    return (
        <div className={Styles["number"]} data-testid="tie-component">
            {number !== resetValue ? number : ""}
        </div>
    );
}
