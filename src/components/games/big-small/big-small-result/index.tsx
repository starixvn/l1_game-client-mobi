import React from "react";
import Styles from "./big-small-result.module.scss";
import { Props } from "./type";

const FishPrawnCrabResult: React.FC<Props> = (props) => {
    const result = props.result ? Object.values(props.result) : [];

    const generateResult = (result: boolean[]) => {
        return result.map((value, index) => (
            <div key={`dot-${index + 1}`} className={`${Styles[`flipResult-dot${index + 1}`]} ${Styles["flipResult-dot"]}`}>
            </div>
        ));
    };

    return (
        <div className={`${Styles["container"]} ${Styles["show-result"]}`}>
            <div className="overlay-mask">
                <div className={Styles["flipResult-sedie-fadeOutDelay"]}>
                    <div className={`${Styles["animation-container"]} ${Styles["result-fadeIn-animation"]}`}>
                        <div className={Styles["shake-plate"]}>
                            <img src="/static/images/shake-baucua.gif" alt="shake" />
                        </div>
                        <div className={Styles["result-set"]}>
                            <div className={Styles["result-plate"]}></div>
                            <div className={Styles["result-container"]}>
                                <div className={Styles["result-1"]}>
                                    <img src="/static/images/dice-bau.png" className={Styles["dice"]} alt="dice" />
                                </div>
                                <div className={Styles["result-2"]}>
                                    <img src="/static/images/dice-cua.png" className={Styles["dice"]} alt="dice" />
                                </div>
                                <div className={Styles["result-3"]}>
                                    <img src="/static/images/dice-ca.png" className={Styles["dice"]} alt="dice" />
                                </div>
                            </div>
                            <div className={Styles["result-bowl"]}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FishPrawnCrabResult;
