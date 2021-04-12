import React, { useState } from "react";

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

const renderHighLightNumber = (result: Result, choice, countsAppear) => {
    let numberAppear = "";
    Object.keys(countsAppear).forEach((number) => {
        if (+ResultBet[choice] === +number) {
            if (+countsAppear[number] === 2) {
                numberAppear = "x2";
                return;
            }

            if (+countsAppear[number] === 3) {
                numberAppear = "x3";
                return;
            }
        }
    });

    return numberAppear;
};

const renderBetOptionByChoice = (choice: string, gameState: GameState, settlementResult: SettlementResult, result: Result) => {
    const { gameConfigs } = useGameContext();
    const { odds } = gameConfigs;
    const isHighLight = gameState !== GameState.LockingBet && settlementResult[choice];
    const isRenderHighLightNumber = result && Object.values(result).indexOf(ResultBet[choice]) > -1;
    const countsAppear = {};
    let numberAppear = "";
    if (result && isRenderHighLightNumber) {
        Object.values(result).forEach((value) => {
            countsAppear[value] = (countsAppear[value] || 0) + 1;
        });
        numberAppear = renderHighLightNumber(result, choice, countsAppear);
    }

    return (
        <BetOption choice={choice} odd={odds[OddNames.single]} isDisplayOdd={false} isHighlight={isHighLight} gameState={gameState}>
            <div className={`${Styles["symbol-size"]} icon-${IconMapper[choice]} ${Styles[`icon-${IconMapper[choice]}`]}`}></div>
            {isHighLight && numberAppear != "" && <div className={`${Styles["highlight-result-label"]} ${Styles[numberAppear]}`}></div>}
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
