import React from "react";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import BetOption from "../../../shared/bet-option";
import { GameState } from "../../../shared/game-base/type";
import { SettlementResult } from "./../fish-prawn-crab";
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

const OddNames = {
    single: "single",
    double: "double",
    triple: "triple",
};

type Props = {
    settlementResult: SettlementResult;
    gameState: GameState;
};

const renderBetOptionByChoice = (choice: string, gameState: GameState, settlementResult: SettlementResult) => {
    const { gameConfigs } = useGameContext();
    const { odds } = gameConfigs;
    const isHighLight = gameState !== GameState.LockingBet && settlementResult[choice];
    return (
        <BetOption choice={choice} odd={odds[OddNames.single]} isDisplayOdd={false} isHighlight={isHighLight} gameState={gameState}>
            <div className={`${Styles["symbol-size"]} icon-${IconMapper[choice]} ${Styles[`icon-${IconMapper[choice]}`]}`}></div>
            <div className={Styles["highlight-result-label"]}></div>
        </BetOption>
    );
};

const FishPrawnCrabBetOptions: React.FunctionComponent<Props> = (props) => {
    const { gameState, settlementResult } = props;
    return (
        <div className={`${Styles["layout-FPC"]}`}>
            <div>{renderBetOptionByChoice(Choices.stag, gameState, settlementResult)}</div>
            <div>{renderBetOptionByChoice(Choices.gourd, gameState, settlementResult)}</div>
            <div>{renderBetOptionByChoice(Choices.rooster, gameState, settlementResult)}</div>
            <div>{renderBetOptionByChoice(Choices.fish, gameState, settlementResult)}</div>
            <div>{renderBetOptionByChoice(Choices.crab, gameState, settlementResult)}</div>
            <div>{renderBetOptionByChoice(Choices.prawn, gameState, settlementResult)}</div>
        </div>
    );
};

export default FishPrawnCrabBetOptions;
