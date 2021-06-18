import { useTranslation } from "next-i18next";
import React from "react";
import { useGameContext } from "../../../../contexts/game-context/game-context";
import Card from "../../../shared/card";
import { ObjectResult, Result, SettlementResult } from "../dragon-tiger";
import { ViewMode } from "../../../shared/game-base/type";
import Styles from "./dragon-tiger-animations.module.scss";

export const CardsAnimation = ({ playAnimation = false }) => {
    const { viewMode } = useGameContext();

    return (
        <div className={`${Styles["draw-cards"]} ${playAnimation ? Styles["has-animation"] : ""}`}>
            <div className={`${Styles["animation-container"]} ${viewMode === ViewMode.simple && Styles["simple-mode"]}`}>
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

const generateResult = (result: ObjectResult[], viewMode: ViewMode) => {
    return result.map((result, index) => {
        return (
            <div key={index} className={Styles[`card${index + 1}`]}>
                <div className={Styles["rotate-card"]}>
                    <Card result={result} viewMode={viewMode}></Card>
                </div>
                <div className={`${Styles["card-back"]} ${viewMode === ViewMode.collapse && Styles["collapse-mode"]}`}></div>
            </div>
        );
    });
};

export const DragonTigerResult: React.FC<Props> = (props) => {
    const { settlementResult } = props;
    const result = props.result ? Object.values(props.result) : [];
    const { viewMode, playResultAnimation } = useGameContext();
    const { t } = useTranslation("dragontiger");

    return (
        <div className={`${Styles["open-cards"]} ${playResultAnimation ? Styles["has-animation"] : ""}`}>
            <div className="overlay-mask-no-bg">
                <div className={`${Styles["animation-container"]} ${viewMode === ViewMode.simple ? Styles["simple-mode"] : ""}`}>
                    <div
                        className={`${Styles["result-highlight"]} ${
                            settlementResult &&
                            (settlementResult.tie ? Styles["tie"] : settlementResult.dragon ? Styles["dragon"] : Styles["tiger"])
                        }`}
                    >
                        {settlementResult && (settlementResult.tie ? t("tie") : settlementResult.dragon ? t("dragonWin") : t("tigerWin"))}
                    </div>
                    {generateResult(result, viewMode)}
                </div>
            </div>
        </div>
    );
};

export const DragonTigerResultCollapse: React.FC<Props> = (props) => {
    const { settlementResult } = props;
    const result = props.result ? Object.values(props.result) : [];
    const { playResultAnimation, viewMode, showResultAfterAnimation } = useGameContext();
    const { t } = useTranslation("dragontiger");
    return (
        <div className={`${Styles["open-cards"]} ${Styles["result-collapse-mode"]} ${playResultAnimation && Styles["has-animation"]}`}>
            <div className={Styles["result-container"]}>{generateResult(result, viewMode)}</div>
            {showResultAfterAnimation && settlementResult && (
                <div className={Styles["result-label"]}>
                    {settlementResult?.tie ? t("tie") : settlementResult?.dragon ? t("dragonWin") : t("tigerWin")}
                </div>
            )}
        </div>
    );
};
