import React from "react";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import BetContainer from "../../../shared/bet-container";
import BetOption from "../../../shared/bet-option";
import { GameState } from "../../../shared/game-base/type";
import { SettlementResult, Result } from "../big-small";
import { useTranslation } from "next-i18next";
import Styles from "./bet-options.module.scss";

const Choices = {
    big: "big",
    small: "small",
};

const OddNames = {
    big: "big",
    small: "small",
};

type Props = {
    settlementResult: SettlementResult;
    gameState: GameState;
};

const renderBetOptionByChoice = (choice: string, gameState: GameState, settlementResult: SettlementResult) => {
    const { gameConfigs } = useGameContext();
    const { t } = useTranslation("taixiu");
    const { odds } = gameConfigs;
    const isHighLight = gameState === GameState.Waiting && settlementResult[choice];
    return (
        <BetOption choice={choice} odd={odds[choice]} isDisplayOdd={false} isHighlight={isHighLight} gameState={gameState}>
            <div>{t(choice)}</div>
        </BetOption>
    );
};

const BigSmallBetOptions: React.FunctionComponent<Props> = (props) => {
    const { gameState, settlementResult } = props;
    return (
        <BetContainer gameState={gameState}>
            <div className={`bet-options-container ${Styles["layout-BS"]}`}>
                <div>{renderBetOptionByChoice(Choices.big, gameState, settlementResult)}</div>
                <div>{renderBetOptionByChoice(Choices.small, gameState, settlementResult)}</div>
            </div>
        </BetContainer>
    );
};

export default BigSmallBetOptions;
