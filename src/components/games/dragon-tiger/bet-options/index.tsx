import React from "react";

import { useGameContext } from "../../../../contexts/game-context/game-context";

import BetOption from "../../../shared/bet-option";
import { GameState } from "../../../shared/game-base/type";
import { SettlementResult } from "../dragon-tiger";
import { useTranslation } from "next-i18next";
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
    const { gameConfigs } = useGameContext();
    const { odds } = gameConfigs;
    const { t } = useTranslation("dragontiger");
    return (
        <div className={`bet-options-container ${Styles["layout-BS"]}`}>
            <BetOption
                choice={Choices.dragon}
                odd={odds[Choices.dragon]}
                isHighlight={settlementResult[Choices.dragon]}
                gameState={gameState}
            >
                <div className="icon-dragon"></div>
                <div className={Styles[Choices.dragon]}>{t(Choices.dragon)}</div>
            </BetOption>
            <BetOption choice={Choices.tiger} odd={odds[Choices.tiger]} isHighlight={settlementResult[Choices.tiger]} gameState={gameState}>
                <div className="icon-tiger"></div>
                <div className={Styles[Choices.tiger]}>{t(Choices.tiger)}</div>
            </BetOption>
            <BetOption choice={Choices.tie} odd={odds[Choices.tie]} isHighlight={settlementResult[Choices.tie]} gameState={gameState}>
                <div className={Styles[Choices.tie]}>{t(Choices.tie)}</div>
            </BetOption>
        </div>
    );
};

export default DragonTigerBetOptions;
