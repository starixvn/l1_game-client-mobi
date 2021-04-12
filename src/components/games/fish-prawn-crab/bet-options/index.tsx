import React from "react";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import BetOption from "../../../shared/bet-option";
import { GameState } from "../../../shared/game-base/type";
import { SettlementResult, Result } from "./../fish-prawn-crab";
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
    stag: "nai",
    gourd: "bau",
    rooster: "ga",
    fish: "ca",
    crab: "cua",
    prawn: "tom",
};

const OddNames = {
    single: "single",
    double: "double",
    triple: "triple",
};

type Props = {
    settlementResult: SettlementResult;
    gameState: GameState;
    result: Result;
};

enum ResultBet {
    stag,
    gourd,
    rooster,
    fish,
    crab,
    prawn,
}

const renderHighLightNumber = (choice: string, countsAppearDice: object, classCount: string) => {
    Object.keys(countsAppearDice).forEach((number) => {
        if (+ResultBet[choice] === +number) {
            if (+countsAppearDice[number] === 2) {
                classCount = "x2";
                return;
            }

            if (+countsAppearDice[number] === 3) {
                classCount = "x3";
                return;
            }
        }
    });

    return classCount;
};

const getClassPrevRound = (gameState: GameState) => {
    switch (gameState) {
        case GameState.BeforeStartRound:
        case GameState.InRound:
            return "prev-round";
        default:
            return "";
    }
};

const renderBetOptionByChoice = (choice: string, gameState: GameState, settlementResult: SettlementResult, result: Result) => {
    const { gameConfigs } = useGameContext();
    const { odds } = gameConfigs;
    const isHighLight = gameState !== GameState.LockingBet && settlementResult[choice];
    const isShowCountOfDice = gameState !== GameState.LockingBet && gameState !== GameState.DisplayResult;
    const isRenderHighLightNumber = result && Object.values(result).indexOf(ResultBet[choice]) > -1;
    const countsAppearDice = {};
    let classCount = "";

    if (result && isRenderHighLightNumber) {
        Object.values(result).forEach((value) => {
            countsAppearDice[value] = (countsAppearDice[value] || 0) + 1;
        });
        classCount = renderHighLightNumber(choice, countsAppearDice, classCount);
    }

    return (
        <BetOption choice={choice} odd={odds[OddNames.single]} isDisplayOdd={false} isHighlight={isHighLight} gameState={gameState}>
            <div className={`${Styles["symbol-size"]} icon-${IconMapper[choice]} ${Styles[`icon-${IconMapper[choice]}`]}`}></div>
            {isShowCountOfDice && classCount != "" && (
                <div className={`${Styles["highlight-result-label"]} ${Styles[getClassPrevRound(gameState)]} ${Styles[classCount]}`}></div>
            )}
        </BetOption>
    );
};

const FishPrawnCrabBetOptions: React.FunctionComponent<Props> = (props) => {
    const { gameState, settlementResult, result } = props;
    return (
        <div className={`${Styles["layout-FPC"]}`}>
            <div>{renderBetOptionByChoice(Choices.stag, gameState, settlementResult, result)}</div>
            <div>{renderBetOptionByChoice(Choices.gourd, gameState, settlementResult, result)}</div>
            <div>{renderBetOptionByChoice(Choices.rooster, gameState, settlementResult, result)}</div>
            <div>{renderBetOptionByChoice(Choices.fish, gameState, settlementResult, result)}</div>
            <div>{renderBetOptionByChoice(Choices.crab, gameState, settlementResult, result)}</div>
            <div>{renderBetOptionByChoice(Choices.prawn, gameState, settlementResult, result)}</div>
        </div>
    );
};

export default FishPrawnCrabBetOptions;
