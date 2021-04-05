import React from "react";
import { SettlementResult } from "./../fish-prawn-crab";
import BetContainer from "../../../shared/bet-container";
import BetOption from "../../../shared/bet-option";
import { GameState } from "../../../shared/game-base/type";
import { Result } from "../fish-prawn-crab";
import FishPrawnCrabResult from "../fish-prawn-crab-result";
import Styles from "./bet-options.module.scss";

const Choices = {
    crab: "crab",
    fish: "fish",
    gourd: "gourd",
    prawn: "prawn",
    rooster: "rooster",
    stag: "stag",
};

const IconMapper = {
    crab: "cua",
    fish: "ca",
    gourd: "bau",
    prawn: "tom",
    rooster: "ga",
    stag: "nai",
};

type Props = {
    result: Result;
    settlementResult: SettlementResult;
    gameState: GameState;
};

const renderBetOptionByChoice = (choice: string, gameState: GameState, settlementResult: SettlementResult) => {
    const isHighLight = gameState === GameState.Waiting && settlementResult[choice];
    return (
        <BetOption choice={choice} isHighlight={isHighLight}>
            <div className={`${Styles["symbol-size"]} icon-${IconMapper[choice]}`}></div>
        </BetOption>
    );
};

const FishPrawnCrabBetOptions: React.FunctionComponent<Props> = (props) => {
    const { gameState, settlementResult } = props;
    return (
        <BetContainer gameState={gameState}>
            <div className={`bet-options-container ${Styles["layout-FPC"]}`}>
                <div>{renderBetOptionByChoice(Choices.stag, gameState, settlementResult)}</div>
                <div>{renderBetOptionByChoice(Choices.gourd, gameState, settlementResult)}</div>
                <div>{renderBetOptionByChoice(Choices.rooster, gameState, settlementResult)}</div>
                <div>{renderBetOptionByChoice(Choices.fish, gameState, settlementResult)}</div>
                <div>{renderBetOptionByChoice(Choices.crab, gameState, settlementResult)}</div>
                <div>{renderBetOptionByChoice(Choices.prawn, gameState, settlementResult)}</div>
            </div>
            {gameState === GameState.DisplayResult && (
                <FishPrawnCrabResult result={props.result} settlementResult={props.settlementResult}></FishPrawnCrabResult>
            )}
        </BetContainer>
    );
};

export default FishPrawnCrabBetOptions;
