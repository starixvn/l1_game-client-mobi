import React, { useState, useEffect, useRef } from "react";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import { Result } from "../big-small";
import { countRedDot } from "../big-small-helper";
import { GameState, ModeView } from "../../../shared/game-base/type";
import Image from "next/image";
import Styles from "./big-small-result.module.scss";

const renderAnimTossDice = () => {
    const wrapperRefAnim = useRef<HTMLDivElement>(null);
    const pathImgAnim = `/static/images/bigsmall_dice.gif?${new Date().getTime()}`;
    useEffect(() => {
        return () => {
            wrapperRefAnim.current = null;
        };
    }, [wrapperRefAnim]);

    return (
        <div className={Styles["toss-dices"]} ref={wrapperRefAnim}>
            <Image key={Date.now()} src={pathImgAnim} alt="shake" width={180} height={180} layout="intrinsic" />
        </div>
    );
};

const BigSmallResult: React.FC<{ result?: Result }> = ({ result }) => {
    const { modeView, playResultAnimation, gameSetting, gameState } = useGameContext();
    const [animToss, setAnimToss] = useState<JSX.Element>(renderAnimTossDice());
    const [isShowCountOfDice, setIsShowCountOfDice] = useState<boolean>(false);
    const wrapperRefResult = useRef<HTMLDivElement>(null);

    const actionByGameState = {
        [GameState.DisplayResult]: () => {
            setTimeout(() => setIsShowCountOfDice(true), (gameSetting.durations.resultAnimation - 1) * 1000);
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
        <div className={`${Styles["container"]} ${Styles["normal-mode"]}`} ref={wrapperRefResult}>
            <div className="overlay-mask-no-bg">
                <div
                    className={`${Styles["animation-container"]} ${playResultAnimation ? Styles["has-animation"] : ""} ${
                        modeView === ModeView.compact ? Styles["compact-mode"] : ""
                    }`}
                >
                    {<div className={Styles["result-plate"]}></div>}
                    {generateResult()}
                </div>
            </div>
        </div>
    );
};

export const BigSmallResultCollapse: React.FC<{ result?: Result }> = ({ result }) => {
    const { playResultAnimation } = useGameContext();
    return (
        <div className={`${Styles["result-collapse-mode"]} ${playResultAnimation ? Styles["has-animation"] : ""}`}>
            {result &&
                Object.values(result).map((value, index) => (
                    <div key={index} className={Styles["result-item"]}>
                        <div className={Styles[`dice${index + 1}`]}></div>
                        <div className={Styles[`result${index + 1}`]}>
                            <img src={`/static/images/bigsmall-dice-${value}.png`} className={`img-fluid ${Styles["dice"]}`} alt="dice" />
                        </div>
                    </div>
                ))}
        </div>
    );
};

export default BigSmallResult;
