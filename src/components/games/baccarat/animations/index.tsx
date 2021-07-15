import { useTranslation } from "next-i18next";
import React from "react";
import { useGameContext } from "../../../../contexts/game-context/game-context";
import { Result, SettlementResult } from "../baccarat";
import Styles from "./baccarat-animations.module.scss";

export const BaccaratResult: React.FC<{ result?: Result; roundId: number }> = ({ result, roundId }) => {
    return <div className={`${Styles["container"]} ${Styles["normal-mode"]}`}></div>;
};

export const BaccaratResultCollapse: React.FC<{ result: Result; settlementResult: SettlementResult }> = ({ result, settlementResult }) => {
    const { gameSetting, playResultAnimation } = useGameContext();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());
    return (
        <div className={`${Styles["result-collapse-mode"]} ${playResultAnimation ? Styles["has-animation"] : ""}`}>
            <div className={Styles["result-container"]}></div>

            {!playResultAnimation && settlementResult && (
                <div className={Styles["result-label"]}>{settlementResult?.big ? t("big") : t("small")}</div>
            )}
        </div>
    );
};
