import React from "react";
import { useTranslation } from "next-i18next";

import { Props } from "./type";
import Styles from "./settlement-result.module.scss";
import { useGameContext } from "../../../contexts/game-context/game-context";

const RoundSettlementResult = ({ title, settlementResult, displayChoices, extendClass }: Props) => {
    const { gameSetting } = useGameContext();
    const { t } = useTranslation(gameSetting.gameName.toLocaleLowerCase());
    const winningTeamName = settlementResult["blue"] ? "blue" : "red";
    const md5Class = gameSetting.supportMD5 ? Styles["keno-match-md5"] : "";
    const settlementClasses = `${Styles["half-round-settlement"]} ${md5Class} ${Styles[extendClass]} `;

    if (settlementResult === undefined) {
        return <></>;
    }

    return (
        <div className={settlementClasses}>
            <div className={Styles["header"]}>{t(title)}</div>
            <div className={`${Styles["result-wrapper"]} ${Styles[winningTeamName]}`}>
                <div className={Styles["winning-name"]}>{t(winningTeamName)}</div>
                <div className={Styles["sum-label"]}>{t("sum")}</div>
                <div className={Styles["result-info"]}>
                    {displayChoices.map((keyName, index) => {
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

export default RoundSettlementResult;
