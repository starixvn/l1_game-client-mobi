import React from "react";
import { useGameContext } from "../../../../contexts/game-context/game-context";
import { Result, SettlementResult, ObjectResult } from "../dragon-tiger";
import { convertRank } from "../dragon-tiger-helper";
import { useTranslation } from "next-i18next";
import Styles from "./dragon-tiger-animations.module.scss";

export const CardsAnimation = () => {
    const { isCompactMode } = useGameContext();

    return (
        <div className={Styles["draw-cards"]}>
            <div className={`${Styles["animation-container"]} ${isCompactMode ? Styles["compact-mode"] : ""}`}>
                <div className={Styles["card1"]}>
                    <div className={Styles["card-shadow"]}></div>
                    <div className={Styles["card-bg"]}></div>
                </div>
                <div className={Styles["card2"]}>
                    <div className={Styles["card-shadow"]}></div>
                    <div className={Styles["card-bg"]}></div>
                </div>
            </div>
        </div>
    );
};

type Props = {
    result?: Result;
    settlementResult?: SettlementResult;
};

const suffixClassMapping = ["card-heart", "card-diamond", "card-club", "card-spade"];
const colorNumberSuffix = ["text-red", "text-red", "text-black", "text-black"];
const pictureCard = {
    J: "card-j-picture",
    Q: "card-q-picture",
    K: "card-k-picture",
};

export const DragonTigerResult: React.FC<Props> = (props) => {
    const { settlementResult } = props;
    const result = props.result ? Object.values(props.result) : [];
    const { isCompactMode } = useGameContext();
    const { t } = useTranslation("dragontiger");

    const generateResult = (result: ObjectResult[]) => {
        return (
            result &&
            result.map((card, index) => {
                return (
                    <div key={index} className={Styles["card" + (index + 1)]}>
                        <div className={Styles["card-shadow"]}></div>
                        <div className={Styles["card-bg"]}>
                            <div className={Styles["result"]}>
                                <div className={Styles["card-group-left"]}>
                                    <div className={`${Styles[colorNumberSuffix[card.type]]} ${Styles["card-number"]}`}>
                                        {convertRank(card.card)}
                                    </div>
                                    <div
                                        className={`${Styles[suffixClassMapping[card.type] + "-small"]} ${Styles["card-suite-small"]}`}
                                    ></div>
                                </div>
                                <div className={Styles["card-group-right"]}>
                                    <div
                                        className={`${
                                            pictureCard[convertRank(card.card)]
                                                ? Styles[pictureCard[convertRank(card.card)]]
                                                : Styles[suffixClassMapping[card.type]]
                                        } ${Styles["card-suite-large"]}`}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })
        );
    };

    return (
        <div className={Styles["open-cards"]}>
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
