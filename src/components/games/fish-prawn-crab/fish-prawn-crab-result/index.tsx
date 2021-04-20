import React from "react";
import Styles from "./fish-prawn-crab-result.module.scss";
import { Props } from "./type";
import { Result } from "./../fish-prawn-crab";

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
const FishPrawnCrabResult: React.FC<Props> = (props) => {
    const { result } = props;

    return (
        <div className={`${Styles["container"]} ${Styles["show-result"]}`}>
            <div className="overlay-mask">
                <div className={`${Styles["animation-container"]} ${Styles["result-fadeIn-animation"]}`}>
                    <div className={Styles["result-set"]}>
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
