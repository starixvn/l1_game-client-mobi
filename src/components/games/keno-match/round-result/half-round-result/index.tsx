import React from "react";
import { useTranslation } from "next-i18next";

import { TeamProps, HalfRoundResultProps } from "./half-round-result-props";
import Styles from "./half-round-result.module.scss";

const calculateTotalPoint = (results: number[]) => results.reduce((a, b) => a + b, 0);

export function HalfResultPopup({ result, active, className, headerText, gameName }: HalfRoundResultProps) {
    const classNames = `${Styles.result} ${className} ${active ? Styles.active : ""}`,
        { t } = useTranslation(gameName),
        blueTeamProps: TeamProps = {
            result: result.blue,
            totalPoint: calculateTotalPoint(result.blue),
            className: Styles.blue,
            teamName: t(`${gameName}:blue`),
        },
        redTeamProps: TeamProps = {
            result: result.red,
            totalPoint: calculateTotalPoint(result.red),
            className: Styles.red,
            teamName: t(`${gameName}:red`),
        };

    return (
        <div className={`${classNames} ${Styles["open-result"]}`}>
             <div className={Styles["header"]}>{headerText}</div>
            <div className={Styles["main-content"]}>
                <Team {...blueTeamProps} />
                <Team {...redTeamProps} />
            </div>
            <div className="progress-bar-team">
                <div className={Styles["blue"]}></div>
                <div className={Styles["red"]}></div>
            </div>
            <div className="total-section">
                <div >Total <div>{blueTeamProps.totalPoint + redTeamProps.totalPoint}</div></div>
            </div>
            
        </div>
    );
}

export function HalfRoundResult({ result, active, className, headerText, gameName }: HalfRoundResultProps) {
    const classNames = `${Styles.result} ${className} ${active ? Styles.active : ""}`,
        { t } = useTranslation(gameName),
        blueTeamProps: TeamProps = {
            result: result.blue,
            totalPoint: calculateTotalPoint(result.blue),
            className: Styles.blue,
            teamName: t(`${gameName}:blue`),
        },
        redTeamProps: TeamProps = {
            result: result.red,
            totalPoint: calculateTotalPoint(result.red),
            className: Styles.red,
            teamName: t(`${gameName}:red`),
        };

    return (
        <div className={classNames}>
            <div className={Styles["overlay"]}>
                <div className={Styles["blue"]}></div>
                <div></div>
                <div className={Styles["red"]}></div>
            </div>
            <div className={Styles["main-content"]}>
                <Team {...blueTeamProps} />
                <div className={Styles["middle-column"]}>
                    <div className={Styles.name}>{headerText}</div>
                    <div className={Styles["score-wrapper"]}>{ t(`${gameName}:total`)} <div className={Styles["score"]}>{blueTeamProps.totalPoint + redTeamProps.totalPoint}</div></div>
                </div>
                <Team {...redTeamProps} />
            </div>
            
        </div>
    );
}

function Team({ result, className, teamName, totalPoint }: TeamProps) {
    const halfLength = Math.ceil(result.length / 2);
    const firstHalfResult = result.slice(0, halfLength);
    const secondHalfResult = result.slice(-halfLength);
    const results = [firstHalfResult, secondHalfResult];

    return (
        <div className={`${Styles.team} ${className}`}>
            {results.map((result, parentIndex) => (
                <TeamResultRow result={result} key={parentIndex} />
            ))}
            <div className={Styles["team-name"]}>
                <span className={Styles["name"]}>{teamName}:</span>
                <span className={Styles["score"]}>{totalPoint}</span>
            </div>
        </div>
    );
}

function TeamResultRow({ result }) {
    return (
        <div className={Styles.row}>
            {result.map((number, index) => (
                <Tie key={index} number={number} />
            ))}
        </div>
    );
}

function Tie({ number }: { number: number }) {
    return <div className={Styles["number"]}>{number}</div>;
}
