import React from "react";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import { ModeView } from "../../../shared/game-base/type";
import { Result } from "./../fish-prawn-crab";
import Styles from "./fish-prawn-crab-result.module.scss";

const nameDices = ["dice-nai", "dice-bau", "dice-ga", "dice-ca", "dice-cua", "dice-tom"];
const classResult = {
    dice1: "result-1",
    dice2: "result-2",
    dice3: "result-3",
};
const generateResult = (result: Result) => {
    return (
        result &&
        Object.keys(result).map((dice, index) => {
            const src = `/static/images/${nameDices[result[dice]]}.png`;
            return (
                <div key={index} className={Styles[classResult[dice]]}>
                    <img src={src} className={Styles["dice"]} alt="dice" />
                </div>
            );
        })
    );
};
const FishPrawnCrabResult: React.FC<{ result?: Result }> = ({ result }) => {
    const { modeView, playResultAnimation } = useGameContext();

    return (
        <div className={Styles["container"]}>
            <div className="overlay-mask-no-bg">
                <div className={`${Styles["animation-container"]} ${modeView === ModeView.compact ? Styles["compact-mode"] : ""}`}>
                    <div className={`${Styles["result-set"]} ${playResultAnimation ? Styles["has-animation"] : ""}`}>
                        <div className={Styles["plate"]}></div>
                        <div className={Styles["result-container"]}>{generateResult(result)}</div>
                        <div className={Styles["bowl"]}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FishPrawnCrabResult;
