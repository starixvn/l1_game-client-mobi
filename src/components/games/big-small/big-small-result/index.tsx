import React from "react";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import Styles from "./big-small-result.module.scss";
import { Props } from "./type";

const BigSmallResult: React.FC<Props> = (props) => {
    const { isCompactMode } = useGameContext();

    const generateResult = (result: number[]) => {
        return result.map((value, index) => (
            <div key={index} className={Styles[`result-${index + 1}`]}>
                <img src={`/static/images/bigsmall-dice-${value}.png`} className={Styles["dice"]} alt="dice" />
            </div>
        ));
    };

    return (
        <div className={`${Styles["container"]} ${Styles["show-result"]}`}>
            <div className="overlay-mask-no-bg">
                <div className={`${Styles["animation-container"]} ${isCompactMode ? Styles["compact-mode"] : ""}`}>
                    <div className={Styles["result-plate"]}></div>
                    <div className={Styles["toss-dices"]}>
                        <img src="/static/images/bigsmall_dice.gif" alt="shake" />
                    </div>
                    <div className={Styles["result-container"]}>{props.result && generateResult(Object.values(props.result) ?? [])}</div>
                </div>
            </div>
        </div>
    );
};

export default BigSmallResult;
