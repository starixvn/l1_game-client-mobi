import React from "react";
import { useTranslation } from "next-i18next";

import { Props } from "./type";
import Styles from "./settlement-result.module.scss";
import { useGameContext } from "../../../contexts/game-context/game-context";

const getGroupNameByChoice = (choice: string) => {
    if (choice.startsWith("red")) {
        return "red";
    }

    if (choice.startsWith("blue")) {
        return "blue";
    }

    return "";
};

const RoundSettlementResult = ({ title, settlementResult, displayChoices, extendClass }: Props) => {
    const { gameSetting } = useGameContext();
    const gameName = gameSetting.gameName.toLocaleLowerCase();
    const { t } = useTranslation(gameName);
    const winningTeamName = settlementResult?.tie ? "tie" : settlementResult?.blue ? "teamBlueWin" : "teamRedWin";
    const settlementClasses = `${Styles["half-round-settlement"]} ${Styles[extendClass]} ${gameName}`;

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
                        const group = getGroupNameByChoice(keyName);
                        console.log(group);
                        return (
                            settlementResult[keyName] && (
                                <>
                                    {group ? (
                                        <div className={Styles["winning-team"]}>
                                            <div className={Styles["team-label"]}>{t(group)} </div>
                                            <div key={index} className={Styles[`result-info-red`]}>
                                                {t(keyName)}
                                            </div>
                                        </div>
                                    ) : (
                                        <div key={index} className={Styles[`result-info-red`]}>
                                            {t(keyName)}
                                        </div>
                                    )}
                                </>
                            )
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default RoundSettlementResult;
