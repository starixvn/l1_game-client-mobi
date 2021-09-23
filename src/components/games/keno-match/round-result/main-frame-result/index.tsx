import { useTranslation } from "next-i18next";
import React from "react";

import TeamResult from "../../../../keno/team-result";
import BallsNumbers from "../../../../shared/balls-numbers";
import { buildHalfMatchProps, calculateTotalPoint, resetValue } from "../../keno-match-helper";
import Styles from "./main-frame-result.module.scss";
import TeamScore from "./team-score";
import MainFrameResultProps, { HalfRoundResultProps, TeamProps } from "./type";

export default function MainFrameResult({ halfTimeResult, fullTimeResult, isActiveLiveFullTime, gameName }: MainFrameResultProps) {
    return (
        <div className={Styles["main-result"]}>
            <div className={Styles.field}>
                <HalfRoundResult
                    {...{
                        ...{
                            result: halfTimeResult,
                            active: isActiveLiveFullTime,
                            gameName,
                        },
                        ...buildHalfMatchProps(false),
                    }}
                />
                <HalfRoundResult
                    {...{
                        ...{
                            result: fullTimeResult,
                            active: !isActiveLiveFullTime,
                            gameName,
                        },
                        ...buildHalfMatchProps(true),
                    }}
                />
            </div>
        </div>
    );
}

export function HalfRoundResult({ result, active, className, headerText, gameName }: HalfRoundResultProps) {
    const classNames = `${Styles.result} ${className} ${active ? Styles.active : ""}`,
        { t } = useTranslation(gameName),
        blueTeamProps: TeamProps = {
            result: result.blue,
            teamName: t("blue"),
            className: "blue-team",
        },
        redTeamProps: TeamProps = {
            result: result.red,
            teamName: t("red"),
            className: "red-team",
        };
    const blueScore = calculateTotalPoint(result.blue);
    const redScore = calculateTotalPoint(result.red);

    return (
        <div className={classNames} data-testid="half-round-result-component">
            <div className={Styles["main-content"]}>
                <TeamResult result={result.blue} />
                <TeamScore teamName="blue" score={blueScore} />
                {/* <Team {...blueTeamProps} /> */}
                <div className={Styles["middle-column"]}>
                    <div className={Styles["header"]}>{t(headerText)}</div>
                    <div className={Styles["score-wrapper"]}>
                        {t("sum")} <div className={Styles["score"]}>{blueScore + redScore}</div>
                    </div>
                </div>
                <TeamResult result={result.red} />
                <TeamScore teamName="red" score={redScore} />
                {/* <Team {...redTeamProps} /> */}
            </div>
        </div>
    );
}

export function Team({ result, teamName, className }: TeamProps) {
    return (
        <div className={`${Styles.team} ${Styles[className]}`} data-testid="team-component">
            <div className={Styles.row} data-testid="team-result-row-component">
                {result.map((number: number, index: number) => (
                    <BallsNumbers key={index} number={number !== resetValue ? number : ""} />
                ))}
            </div>
            <div className={Styles["team-name"]}>
                <span className={Styles["map-winning"]}></span>
                <span className={Styles["name"]}>{teamName}:</span>
                <span className={Styles["score"]}>{calculateTotalPoint(result)}</span>
            </div>
        </div>
    );
}
