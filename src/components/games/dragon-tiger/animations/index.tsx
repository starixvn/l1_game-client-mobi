import { useTranslation } from "next-i18next";
import React, { useState, useEffect } from "react";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import Card from "../../../shared/card";
import { ViewMode } from "../../../shared/game-base/type";
import { ObjectResult } from "../dragon-tiger";
import { Props, ResultChoiceMapping } from "./type";
import Styles from "./dragon-tiger-animations.module.scss";

const classHasAnimation = "has-animation";

const generateResult: React.FC<{ result: ObjectResult[]; viewMode: ViewMode; translateChoiceMapping?: string[]; scores?: number[] }> = ({
    result,
    viewMode,
    translateChoiceMapping,
    scores,
}): any => {
    const classCards = ["dragon-score", "tiger-score"];
    return result.map((result, index) => {
        return (
            <div key={index} className={Styles[`card${index + 1}`]}>
                <div className={Styles["rotate-card"]}>
                    <Card result={result} viewMode={viewMode}></Card>
                </div>
                <div className={`${Styles["card-back"]} ${viewMode === ViewMode.collapse && Styles["collapse-mode"]}`}></div>
                {viewMode === ViewMode.full && (
                    <div className={`${Styles[classCards[index]]} ${Styles["score"]}`}>
                        {translateChoiceMapping[index]}:<span className={Styles["score-number"]}>{scores[index]}</span>
                    </div>
                )}
            </div>
        );
    });
};

const SumScore = (number: number) => {
    return number + 1;
};

export const DragonTigerResult: React.FC<Props> = (props) => {
    const { t } = useTranslation("dragontiger");
    const { viewMode, playResultAnimation } = useGameContext();
    const [scoreTiger, setScoreTiger] = useState<number>(0);
    const [scoreDragon, setScoreDragon] = useState<number>(0);

    const result = props.result ? Object.values(props.result) : [];
    const translateChoiceMapping = [t("dragon"), t("tiger")];
    let timeouts: NodeJS.Timeout[] = [];

    useEffect(() => {
        if (playResultAnimation) {
            const cardOpenedTimes = [500, 900];
            result.forEach((cardValue, index) => {
                const cardNumber = cardValue.card;
                const timeout = setTimeout(() => {
                    if (ResultChoiceMapping.dragon === index) {
                        setScoreDragon(SumScore(cardNumber));
                    } else {
                        setScoreTiger(SumScore(cardNumber));
                    }
                }, cardOpenedTimes[index]);
                timeouts.push(timeout);
            });
        } else {
            result.forEach((cardValue, index) => {
                const cardNumber = cardValue.card;
                if (ResultChoiceMapping.dragon === index) {
                    setScoreDragon(SumScore(cardNumber));
                } else {
                    setScoreTiger(SumScore(cardNumber));
                }
            });
        }

        return () =>
            timeouts.forEach((timeout) => {
                clearTimeout(timeout);
            });
    }, []);

    return (
        <div className={`${Styles["open-cards"]} ${playResultAnimation ? Styles[classHasAnimation] : ""}`}>
            <div className="overlay-mask">
                <div className={`${Styles["animation-container"]} ${playResultAnimation ? "" : "move-up-no-animation"}`}>
                    {generateResult({
                        result: result,
                        viewMode: viewMode,
                        translateChoiceMapping: translateChoiceMapping,
                        scores: [scoreDragon, scoreTiger],
                    })}
                </div>
            </div>
        </div>
    );
};

export const DragonTigerResultCollapse: React.FC<Props> = (props) => {
    const { settlementResult } = props;
    const result = props.result ? Object.values(props.result) : [];
    const { playResultAnimation, viewMode } = useGameContext();
    const { t } = useTranslation("dragontiger");
    return (
        <div className={`${Styles["open-cards"]} ${Styles["result-collapse-mode"]} ${playResultAnimation && Styles[classHasAnimation]}`}>
            <div className={Styles["result-container"]}>
                {generateResult({
                    result: result,
                    viewMode: viewMode,
                })}
            </div>
            {!playResultAnimation && settlementResult && (
                <div className={Styles["result-label"]}>
                    {settlementResult?.tie ? t("tie") : settlementResult?.dragon ? t("dragonWin") : t("tigerWin")}
                </div>
            )}
        </div>
    );
};
