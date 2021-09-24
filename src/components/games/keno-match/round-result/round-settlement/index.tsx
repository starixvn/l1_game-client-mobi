import React from "react";
import { useTranslation } from "next-i18next";

import { buildHalfMatchProps } from "../../keno-match-helper";
import { Props } from "./type";
import Styles from "./round-settlement.module.scss";

const KenoMatchMD5Name = "kenomatch2";

const RoundSettlement = ({ gameName, settlementResult, isFirstHalf }: Props) => {
    const { t } = useTranslation(gameName),
        props = {
            settlementResult,
            ...buildHalfMatchProps(isFirstHalf),
        };
    const isKenoMatchMD5 = gameName === KenoMatchMD5Name;

    if (settlementResult === undefined) {
        return <></>;
    }

    const winningTeamName = settlementResult["blue"] ? "blue" : "red";
    return (
        <div className={`${Styles["half-round-settlement"]} ${isKenoMatchMD5 ? Styles["keno-match-md5"] : ""}`}>
            <div className={Styles["header"]}>{t(props.headerText)}</div>
            <div className={`${Styles["result-wrapper"]} ${Styles[winningTeamName]}`}>
                <div className={Styles["winning-name"]}>{t(winningTeamName)}</div>
                <div className={Styles["sum-label"]}>{t("sum")}</div>
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
