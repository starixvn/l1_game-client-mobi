import React, { useState, useEffect, useRef } from "react";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import { Result } from "../big-small";
import { countRedDot } from "../big-small-helper";
import { GameState } from "../../../shared/game-base/type";
import { v4 as uuidV4 } from "uuid";
import Image from "next/image";
import Styles from "./big-small-result.module.scss";

const imageIdMapping = { 1: "bigsmall_dice", 4: "turbo_bigsmall_dice" };

const renderAnimTossDice = () => {
    const { gameSetting } = useGameContext();
    const wrapperRefAnim = useRef<HTMLDivElement>(null);
    const pathImgResult = `/static/images/${imageIdMapping[gameSetting.id]}.gif`;
    useEffect(() => {
        return () => {
            wrapperRefAnim.current = null;
        };
    }, [wrapperRefAnim]);

    return (
        <div className={Styles["toss-dices"]} ref={wrapperRefAnim}>
            <Image key={uuidV4} src={pathImgResult} alt="shake" width={180} height={180} layout="intrinsic" />
        </div>
    );
};

const BigSmallResult: React.FC<{ result?: Result }> = ({ result }) => {
    const { isCompactMode, playResultAnimation, gameSetting, gameState } = useGameContext();
    const [animToss, setAnimToss] = useState<JSX.Element>(renderAnimTossDice());
    const [isShowCountOfDice, setIsShowCountOfDice] = useState<boolean>(false);
    const wrapperRefResult = useRef<HTMLDivElement>(null);

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
            <>
                {animToss}
                <div className={Styles["result-container"]}>
                    {result &&
                        Object.values(result).map((value, index) => (
                            <div key={index} className={Styles[`result-${index + 1}`]}>
                                <img src={`/static/images/bigsmall-dice-${value}.png`} className={Styles["dice"]} alt="dice" />
                            </div>
                        ))}
                    {isShowCountOfDice && <div className={Styles["total-dice"]}>{result && countRedDot(result)}</div>}
                </div>
            </>
        );
    };

    useEffect(() => {
        actionByGameState[gameState] && actionByGameState[gameState]();
    }, [gameState]);

    useEffect(() => {
        return () => {
            setAnimToss(<></>);
            wrapperRefResult.current = null;
        };
    }, []);

    return (
        <div className={`${Styles["container"]} ${Styles["show-result"]}`} ref={wrapperRefResult}>
            <div className="overlay-mask-no-bg">
                <div
                    className={`${Styles["animation-container"]} ${playResultAnimation ? Styles["has-animation"] : ""} ${
                        isCompactMode ? Styles["compact-mode"] : ""
                    }`}
                >
                    <div className={Styles["result-plate"]}></div>
                    {generateResult()}
                </div>
            </div>
        </div>
    );
};

export default BigSmallResult;
