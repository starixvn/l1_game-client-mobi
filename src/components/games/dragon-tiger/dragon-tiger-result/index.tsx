import React from "react";
import Styles from "./big-small-result.module.scss";
import { Props } from "./type";

const DragonTigerResult: React.FC<Props> = (props) => {
    const result = props.result ? Object.values(props.result) : [];

    const generateResult = (result: boolean[]) => {
        return result.map((value, index) => (
            <div key={`dot-${index + 1}`} className={`${Styles[`flipResult-dot${index + 1}`]} ${Styles["flipResult-dot"]}`}></div>
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
                    <div className={Styles["result-container"]}>
                        <div className={Styles["result-1"]}>
                            <img src="/static/images/bigsmall-dice-1.png" className={Styles["dice"]} alt="dice" />
                        </div>
                        <div className={Styles["result-2"]}>
                            <img src="/static/images/bigsmall-dice-2.png" className={Styles["dice"]} alt="dice" />
                        </div>
                        <div className={Styles["result-3"]}>
                            <img src="/static/images/bigsmall-dice-3.png" className={Styles["dice"]} alt="dice" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DragonTigerResult;
