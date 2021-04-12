import React from "react";

import { useGameContext } from "../../../../contexts/game-context/game-context";

import BetOption from "../../../shared/bet-option";
import { GameState } from "../../../shared/game-base/type";
import { SettlementResult, Result } from "../dragon-tiger";
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

const renderBetOptionByChoice = (choice: string, gameState: GameState, settlementResult: SettlementResult) => {
    const { gameConfigs } = useGameContext();
    const { t } = useTranslation("dragontiger");
    const { odds } = gameConfigs;
    const isHighLight = gameState === GameState.Waiting && settlementResult[choice];
    return (
        <BetOption choice={choice} odd={odds[choice]} isHighlight={isHighLight} gameState={gameState}>
            <div className={Styles[choice]}>{t(choice)}</div>
        </BetOption>
    );
};

const DragonTigerBetOptions: React.FunctionComponent<Props> = (props) => {
    const { gameState, settlementResult } = props;
    return (
        <div className={`bet-options-container ${Styles["layout-BS"]}`}>
            <div>{renderBetOptionByChoice(Choices.dragon, gameState, settlementResult)}</div>
            <div>{renderBetOptionByChoice(Choices.tiger, gameState, settlementResult)}</div>
            <div>{renderBetOptionByChoice(Choices.tie, gameState, settlementResult)}</div>
        </div>
    );
};

export default DragonTigerBetOptions;
