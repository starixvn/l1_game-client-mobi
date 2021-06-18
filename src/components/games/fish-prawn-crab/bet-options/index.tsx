import React, { useEffect, useState } from "react";

import { OddNames, ResultBet } from "..";
import { useGameContext } from "../../../../contexts/game-context/game-context";
import BetOption from "../../../shared/bet-option";
import { GameState, ViewMode } from "../../../shared/game-base/type";
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

type Props = {
    settlementResult: SettlementResult;
    gameState: GameState;
    result: Result;
};

const renderHighLightNumber = (choice: string, countsAppearDice: object) => {
    let classCount = "";
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

const renderBetOptionByChoice = (choice: string, gameState: GameState, settlementResult: SettlementResult, countsAppearDice: object) => {
    const { gameConfigs, viewMode, gameSetting } = useGameContext();
    const { odds } = gameConfigs;
    const isHighLight = gameState !== GameState.LockingBet && settlementResult[choice];
    const classCount = renderHighLightNumber(choice, countsAppearDice);
    const [isShowCountOfDice, setIsShowCountOfDice] = useState<boolean>(false);
    const classChoice = `icon-${IconMapper[choice]}`;

    const actionByGameState = {
        [GameState.LockingBet]: () => {
            setIsShowCountOfDice(false);
        },
        [GameState.DisplayResult]: () => {
            setTimeout(() => setIsShowCountOfDice(true), gameSetting.durations.resultAnimation * 1000);
        },
        [GameState.Waiting]: () => {
            setIsShowCountOfDice(true);
        },
        [GameState.InRound]: () => {
            setIsShowCountOfDice(true);
        },
        [GameState.BeforeStartRound]: () => {
            setIsShowCountOfDice(true);
        },
    };

    useEffect(() => {
        actionByGameState[gameState] && actionByGameState[gameState]();
    }, [gameState]);

    useEffect(() => {
        return () => {
            setIsShowCountOfDice(false);
        };
    }, []);

    return (
        <BetOption choice={choice} odd={odds[OddNames.single]} isDisplayOdd={false} isHighlight={isHighLight} gameState={gameState}>
            <div
                className={`${Styles["symbol-size"]} icon-${IconMapper[choice]} ${Styles[classChoice]} ${
                    viewMode === ViewMode.simple ? Styles["simple-mode"] : ""
                }`}
            ></div>
            {isShowCountOfDice && classCount !== "" && (
                <div className={`${Styles["highlight-result-label"]} ${Styles[getClassPrevRound(gameState)]} ${Styles[classCount]}`}></div>
            )}
        </BetOption>
    );
};

const FishPrawnCrabBetOptions: React.FunctionComponent<Props> = (props) => {
    const { gameState, settlementResult, result } = props;
    const countsAppearDice = {};

    if (result) {
        Object.values(result).forEach((value) => {
            countsAppearDice[value] = (countsAppearDice[value] || 0) + 1;
        });
    }

    return (
        <div className={`${Styles["layout-FPC"]}`}>
            <div>{renderBetOptionByChoice(Choices.stag, gameState, settlementResult, countsAppearDice)}</div>
            <div>{renderBetOptionByChoice(Choices.gourd, gameState, settlementResult, countsAppearDice)}</div>
            <div>{renderBetOptionByChoice(Choices.rooster, gameState, settlementResult, countsAppearDice)}</div>
            <div>{renderBetOptionByChoice(Choices.fish, gameState, settlementResult, countsAppearDice)}</div>
            <div>{renderBetOptionByChoice(Choices.crab, gameState, settlementResult, countsAppearDice)}</div>
            <div>{renderBetOptionByChoice(Choices.prawn, gameState, settlementResult, countsAppearDice)}</div>
        </div>
    );
};

export default FishPrawnCrabBetOptions;
