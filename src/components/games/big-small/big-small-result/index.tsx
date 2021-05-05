import React from "react";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import { Result } from "../big-small";
import Styles from "./big-small-result.module.scss";

const BigSmallResult: React.FC<{ result?: Result }> = ({ result }) => {
    const { isCompactMode, playResultAnimation } = useGameContext();

    const generateResult = () => {
        return (
            result &&
            Object.values(result).map((value, index) => (
                <div key={index} className={Styles[`result-${index + 1}`]}>
                    <img src={`/static/images/bigsmall-dice-${value}.png`} className={Styles["dice"]} alt="dice" />
                </div>
            ))
        );
    };

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
                        <img src="/static/images/bigsmall_dice.gif" alt="shake" />
                    </div>
                    <div className={Styles["result-container"]}>{generateResult()}</div>
                </div>
            </div>
        </div>
    );
};

export default BigSmallResult;
