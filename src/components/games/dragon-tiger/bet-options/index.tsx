import { useTranslation } from "next-i18next";
import React from "react";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import BetOption from "../../../shared/bet-option";
import { GameState } from "../../../shared/game-base/type";
import { SettlementResult } from "../dragon-tiger";
import Styles from "./bet-options.module.scss";

const Choices = {
    dragon: "dragon",
    tiger: "tiger",
    tie: "tie",
};

type Props = {
    settlementResult: SettlementResult;
    gameState: GameState;
};

const DragonTigerBetOptions: React.FunctionComponent<Props> = (props) => {
    const { gameState, settlementResult } = props;
    const { gameConfigs, gameSetting } = useGameContext();
    const { odds } = gameConfigs;
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());

    return (
        <div className={`bet-options-container ${Styles["layout-dragon-tiger"]}`}>
            <div className={Styles["choice-tie"]}>
                <BetOption choice={Choices.tie} odd={odds[Choices.tie]} isHighlight={settlementResult[Choices.tie]} gameState={gameState}>
                    <div className={Styles["text-tie"]}>{t(Choices.tie)}</div>
                </BetOption>
            </div>
            <BetOption
                choice={Choices.dragon}
                odd={odds[Choices.dragon]}
                isHighlight={settlementResult[Choices.dragon]}
                gameState={gameState}
            >
                <div className={Styles["icon-group"]}>
                    <div className={`icon-dragon ${Styles["icon"]}`}></div>
                    <div className={Styles["text-dragon"]}>{t(Choices.dragon)}</div>
                </div>
            </BetOption>
            <BetOption choice={Choices.tiger} odd={odds[Choices.tiger]} isHighlight={settlementResult[Choices.tiger]} gameState={gameState}>
                <div className={Styles["icon-group"]}>
                    <div className={`icon-tiger ${Styles["icon"]}`}></div>
                    <div className={Styles["text-tiger"]}>{t(Choices.tiger)}</div>
                </div>
            </BetOption>
        </div>
    );
};

export default DragonTigerBetOptions;
