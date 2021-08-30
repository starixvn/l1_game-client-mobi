import React from "react";
import { useTranslation } from "next-i18next";

import { TeamProps, HalfRoundResultProps } from "./half-round-result-props";
import Styles from "./half-round-result.module.scss";

export default function HalfRoundResult({result, active, className, headerText, gameName}: HalfRoundResultProps) {
    const classNames = `${Styles.result} ${className} ${active ? Styles.active : ""}`,
     { t } = useTranslation(gameName),
    blueTeamProps: TeamProps = {
        result: result.blue,
        totalPoint: result.blue.reduce((a, b) => a + b, 0),
        className: Styles.blue,
        teamName: t(`${gameName}:blue`)
    },
    redTeamProps:  TeamProps = {
        result: result.red,
        totalPoint: result.red.reduce((a, b) => a + b, 0),
        className: Styles.red,
        teamName: t(`${gameName}:red`)
    };

    return (
        <div className={classNames}>
            <Team {...blueTeamProps}/>
            <div className={Styles["middle-column"]}>
                <div className={Styles.name}>
                   {headerText}
                </div>
                <div>Total : {blueTeamProps.totalPoint + redTeamProps.totalPoint}</div>
            </div>
            <Team  {...redTeamProps} />
        </div>
    );
}

function Team({result, className, teamName, totalPoint}: TeamProps) {
    return (
        <div className={`${Styles.team} ${className}`}>
            <div className={Styles.row}>
                {result.slice(0, 4).map((number, index) => (
                    <Tie key={index} number={number} />
                ))}
            </div>
            <div className={Styles.row}>
                {result.slice(5, 9).map((number, index) => (
                    <Tie key={index} number={number} />
                ))}
            </div>
            <div className={Styles["team-name"]}>{teamName}: {totalPoint}</div>
        </div>
    );
}

function Tie({ number }: { number: number }) {
    return (
        <div className={Styles.tie} style={{ transform: "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)" }}>
            {number}
        </div>
    );
}
