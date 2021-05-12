import React, { useState, useEffect, useRef } from "react";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import { Result } from "../big-small";
import { countRedDot } from "../big-small-helper";
import { GameState } from "../../../shared/game-base/type";
import Styles from "./big-small-result.module.scss";

const imageIdMapping = { 1: "bigsmall_dice", 4: "turbo_bigsmall_dice" };
const BigSmallResult: React.FC<{ result?: Result }> = ({ result }) => {
    const { isCompactMode, playResultAnimation, gameSetting, gameState } = useGameContext();
    const [isShowCountOfDice, setIsShowCountOfDice] = useState<boolean>(false);
    const pathImgResult = `/static/images/${imageIdMapping[gameSetting.id]}.gif`;
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

    const generateResult = () => {
        return (
            <div className={Styles["result-container"]}>
                {result &&
                    Object.values(result).map((value, index) => (
                        <div key={index} className={Styles[`result-${index + 1}`]}>
                            <img src={`/static/images/bigsmall-dice-${value}.png`} className={Styles["dice"]} alt="dice" />
                        </div>
                    ))}
                {isShowCountOfDice && <div className={Styles["total-dice"]}>{result && countRedDot(result)}</div>}
            </div>
        );
    };

    useEffect(() => {
        actionByGameState[gameState] && actionByGameState[gameState]();
    }, [gameState]);

    return (
        <div className={`${Styles["container"]} ${Styles["show-result"]}`}>
            <div className="overlay-mask-no-bg">
                <div
                    className={`${Styles["animation-container"]} ${playResultAnimation ? Styles["has-animation"] : ""} ${
                        isCompactMode ? Styles["compact-mode"] : ""
                    }`}
                >
                    <div className={Styles["result-plate"]}></div>
                    <div className={Styles["toss-dices"]}>
                        <img src={pathImgResult} alt="shake" />
                    </div>
                    {generateResult()}
                </div>
            </div>
        </div>
    );
};

export default BigSmallResult;
