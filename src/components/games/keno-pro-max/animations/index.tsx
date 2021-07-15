import { useTranslation } from "next-i18next";
import React from "react";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import { RoundDot } from "../../../shared/round-history/dot";
import { Result, SettlementResult } from "../keno-pro-max";
import Styles from "./keno-pro-max-animations.module.scss";

export const KenoProMaxResult: React.FC<{ result?: Result; roundId: number }> = ({ result, roundId }) => {
    const { playResultAnimation, gameSetting } = useGameContext();

    return <div className={`${Styles["container"]} ${Styles["normal-mode"]}`}></div>;
};

export const KenoProMaxResultCollapse: React.FC<{ result: Result; settlementResult: SettlementResult }> = ({
    result,
    settlementResult,
}) => {
    const { playResultAnimation } = useGameContext();
    const { t } = useTranslation("xocxoc");
    return (
        <div className={`${Styles["result-collapse-mode"]} ${playResultAnimation ? Styles["has-animation"] : ""}`}>
            <div className={Styles["result-container"]}></div>

            {!playResultAnimation && settlementResult && (
                <div className={Styles["result-label"]}>{settlementResult?.odd ? t("odd") : t("even")}</div>
            )}
        </div>
    );
};
