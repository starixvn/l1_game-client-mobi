import { useTranslation } from "next-i18next";
import React from "react";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import Card from "../../../shared/card";
import { ObjectResult, Result, SettlementResult } from "../dragon-tiger";
import Styles from "./dragon-tiger-animations.module.scss";

export const CardsAnimation = ({ playAnimation = false }) => {
    const { isCompactMode } = useGameContext();

    return (
        <div className={`${Styles["draw-cards"]} ${playAnimation ? Styles["has-animation"] : ""}`}>
            <div className={`${Styles["animation-container"]} ${isCompactMode ? Styles["compact-mode"] : ""}`}>
                <div className={Styles["card1"]}>
                    <div className={Styles["card-shadow"]}></div>
                    <div className={Styles["card-back"]}></div>
                </div>
                <div className={Styles["card2"]}>
                    <div className={Styles["card-shadow"]}></div>
                    <div className={Styles["card-back"]}></div>
                </div>
            </div>
        </div>
    );
};

type Props = {
    result?: Result;
    settlementResult?: SettlementResult;
};

export const DragonTigerResult: React.FC<Props> = (props) => {
    const { settlementResult } = props;
    const result = props.result ? Object.values(props.result) : [];
    const { isCompactMode } = useGameContext();
    const { t } = useTranslation("dragontiger");

    const generateResult = (result: ObjectResult[]) => {
        return result.map((result, index) => {
            return (
                <div key={index} className={Styles["card" + (index + 1)]}>
                    <div className={Styles["rotate-card"]}>
                        <Card result={result}></Card>
                    </div>
                    <div className={Styles["card-back"]}></div>
                </div>
            );
        });
    };

    return (
        <div className={`${Styles["open-cards"]} ${Styles["has-animation"]}`}>
            <div className="overlay-mask-no-bg">
                <div className={`${Styles["animation-container"]} ${isCompactMode ? Styles["compact-mode"] : ""}`}>
                    {generateResult(result)}
                    <div className={Styles["result-highlight"]}>
                        {settlementResult && (settlementResult.tie ? t("tie") : settlementResult.dragon ? t("dragonWin") : t("tigerWin"))}
                    </div>
                </div>
            </div>
        </div>
    );
};
