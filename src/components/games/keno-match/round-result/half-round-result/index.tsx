import React from "react";
import { useTranslation } from "next-i18next";

import { TeamProps, HalfRoundResultProps, HalfRoundResultPopupProps } from "./half-round-result-props";
import { SettlementResult } from "../../type";
import Styles from "./half-round-result.module.scss";

const calculateTotalPoint = (results: number[]) => results.reduce((a, b) => a + b, 0);

export function HalfResultPopup({ result, settlementResult, active, className, headerText, gameName }: HalfRoundResultPopupProps) {
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

    const buildWinning = (settlementResult: SettlementResult) => {
        if(settlementResult === undefined)
        {
            return  <></>;
        }
        
        return Object.keys(settlementResult).map((key) => {
            return settlementResult[key] && ["odd", "even", "over", "under"].includes(key) ? (
                <div key={key} className={Styles["result-info-red"] }>
                    {t(key)}
                </div>
            ) : (
                <></>
            );
        })
    };

    return (
        <div className={`${classNames} ${Styles["open-result"]}`}>
            <div className={Styles["header"]}>{t(headerText)}</div>
            <div className={Styles["main-content"]}>
                <Team {...blueTeamProps} />
                <Team {...redTeamProps} />
            </div>
            <div className={Styles["progress-bar-team"]}>
                <div className={Styles["title"]}>
                    <span className={Styles["title-blue"]}>{t("blue")}</span>
                    <span className={Styles["title-red"]}>{t("red")}</span>
                </div>
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
            <div className={Styles["label-total"]}>{t("sum")} </div>
            <div className={Styles["total-section"]}>
                <div className={Styles["result-info"]}>{buildWinning(settlementResult)}</div>
                <div className={Styles["total-score-match"]}>
                    {t("total")} <div className={Styles["score-match"]}>{totalPoint}</div>
                </div>
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
    const halfLength = Math.ceil(result.length / 2);
    const firstHalfResult = result.slice(0, halfLength);
    const secondHalfResult = result.slice(-halfLength);
    const results = [firstHalfResult, secondHalfResult];

    return (
        <div className={`${Styles.team}`} data-testid="team-component">
            {results.map((result, parentIndex) => (
                <TeamResultRow result={result} key={parentIndex} />
            ))}
            <div className={Styles["team-name"]}>
                <span className={Styles["name"]}>{teamName}:</span>
                <span className={Styles["score"]}>{calculateTotalPoint(result)}</span>
            </div>
        </div>
    );
}

export function TeamResultRow({ result }) {
    return (
        <div className={Styles.row} data-testid="team-result-row-component">
            {result.map((number: number, index: number) => (
                <Tie key={index} number={number} />
            ))}
        </div>
    );
}

export function Tie({ number }: { number: number }) {
    return (
        <div className={Styles["number"]} data-testid="tie-component">
            {number}
        </div>
    );
}
