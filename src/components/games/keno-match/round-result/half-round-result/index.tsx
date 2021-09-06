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
            teamName: t("blue"),
        },
        redTeamProps: TeamProps = {
            result: result.red,
            totalPoint: calculateTotalPoint(result.red),
            className: Styles.red,
            teamName: t("red"),
        };

    return (
        <div className={`${classNames} ${Styles["open-result"]}`}>
             <div className={Styles["header"]}>{t(headerText)}</div>
            <div className={Styles["main-content"]}>
                <Team {...blueTeamProps} />
                <Team {...redTeamProps} />
            </div>
            <div className={Styles["progress-bar-team"]}>
                <div className={Styles["title"]}><span className={Styles["title-blue"]}>Đội xanh</span><span className={Styles["title-red"]}>Đội đỏ</span></div>
                <div className={Styles["progress-bar"]}>
                    <div className={Styles["triangle"]}></div>
                    <div className={Styles["blue-team"]}>
                        <span className={Styles["blue-score"]}></span>
                    </div>
                    <div className={Styles["sperate"]}></div>
                    <div className={Styles["red-team"]}>
                        <span className={Styles["red-score"]}></span>
                    </div>
                </div>                
            </div>
            <div className={Styles["label-total"]}>Tổng</div>
            <div className={Styles["total-section"]}>
                <div className={Styles["result-info"]}>
                    <div className={Styles["result-info-blue"]}>Tài</div>
                    <div className={Styles["result-info-red"]}>Lẻ</div>
                </div>
                <div className={Styles["total-score-match"]}>Total <div className={Styles["score-match"]}>{blueTeamProps.totalPoint + redTeamProps.totalPoint}</div></div>
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
            teamName: t("blue"),
        },
        redTeamProps: TeamProps = {
            result: result.red,
            totalPoint: calculateTotalPoint(result.red),
            className: Styles.red,
            teamName: t("red"),
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
                    <div className={Styles.name}>{t(headerText)}</div>
                    <div className={Styles["score-wrapper"]}>
                        {t("total")} <div className={Styles["score"]}>{blueTeamProps.totalPoint + redTeamProps.totalPoint}</div>
                    </div>
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
