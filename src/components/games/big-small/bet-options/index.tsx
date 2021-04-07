import React from "react";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import BetContainer from "../../../shared/bet-container";
import BetOption from "../../../shared/bet-option";
import { GameState } from "../../../shared/game-base/type";
import { BigSmallSettlementResult, BigSmallResult } from "../big-small";
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
    result: BigSmallResult;
    settlementResult: BigSmallSettlementResult;
    gameState: GameState;
};

const renderBetOptionByChoice = (choice: string, gameState: GameState, settlementResult: BigSmallSettlementResult) => {
    const { gameConfigs } = useGameContext();
    const { odds } = gameConfigs;
    const isHighLight = gameState === GameState.Waiting && settlementResult[choice];
    return (
        <BetOption choice={choice} odd={odds[OddNames.big]} isDisplayOdd={false} isHighlight={isHighLight}>
            <div>{choice}</div>
        </BetOption>
    );
};

const FishPrawnCrabBetOptions: React.FunctionComponent<Props> = (props) => {
    const { gameState, settlementResult } = props;
    return (
        <BetContainer gameState={gameState}>
            <div className={`bet-options-container ${Styles["layout-FPC"]}`}>
                <div>{renderBetOptionByChoice(Choices.big, gameState, settlementResult)}</div>
                <div>{renderBetOptionByChoice(Choices.small, gameState, settlementResult)}</div>
            </div>
        </BetContainer>
    );
};

export default FishPrawnCrabBetOptions;
