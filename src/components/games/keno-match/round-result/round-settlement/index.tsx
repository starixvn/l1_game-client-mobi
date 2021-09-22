import React from "react";
import { useTranslation } from "next-i18next";

import { buildHalfMatchProps } from "../../keno-match-helper";
import { SettlementResult } from "../../type";
import Styles from "./round-settlement.module.scss";

export interface HalfRoundSettlementProps {
    settlementResult: SettlementResult;
    gameName: string;
    isActiveLiveFullTime: boolean;
}

const RoundSettlement = ({ gameName, settlementResult, isActiveLiveFullTime }: HalfRoundSettlementProps) => {
    const { t } = useTranslation(gameName),
        props = {
            settlementResult,
            ...buildHalfMatchProps(isActiveLiveFullTime),
        };

    if (settlementResult === undefined) {
        return <></>;
    }

    const winningTeamName = settlementResult["blue"] ? "blue" : "red";
    return (
        <div className={`${Styles["half-round-settlement"]}`}>
            <div className={Styles["header"]}>{t(props.headerText)}</div>
            <div className={`${Styles["result-wrapper"]} ${winningTeamName}`}>
                <div className={Styles["result-info"]}>
                    <div className={Styles[`result-info-${winningTeamName}`]}>{t(winningTeamName)}</div>
                </div>
                <div className={Styles["result-info"]}>
                    {["odd", "even", "over", "under"].map((keyName, index) => {
                        return (
                            settlementResult[keyName] && (
                                <div key={index} className={Styles["result-info-red"]}>
                                    {t(keyName)}
                                </div>
                            )
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default RoundSettlement;
