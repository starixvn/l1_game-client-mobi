import React from "react";
import Styles from "./big-small-result.module.scss";
import { Props } from "./type";

const BigSmallResult: React.FC<Props> = (props) => {
    const result: number[] = props.result ? Object.values(props.result) : [];
    const generateResult = (result: number[]) => {
        return result.map((value, index) => (
            <div key={"result-index-" + index} className={`${Styles[`result-${index + 1}`]}`}>
                <img src={`/static/images/bigsmall-dice-${value}.png`} className={Styles["dice"]} alt="dice" />
            </div>
        ));
    };

    return (
        <div className={`${Styles["container"]} ${Styles["show-result"]}`}>
            <div className="overlay-mask">
                <div className={`${Styles["animation-container"]} ${Styles["result-fadeIn-animation"]}`}>
                    <div className={Styles["result-plate"]}></div>
                    <div className={Styles["toss-dices"]}>
                        <img src="/static/images/bigsmall_dice.gif" alt="shake" />
                    </div>
                    <div className={Styles["result-container"]}>{generateResult(result)}</div>
                </div>
            </div>
        </div>
    );
};

export default BigSmallResult;
