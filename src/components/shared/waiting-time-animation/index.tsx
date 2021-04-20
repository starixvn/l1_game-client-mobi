import React from "react";
import Styles from "./waiting-time-animation.module.scss";

const WaitingTimeAnimation: React.FC<{ remainingTime: number }> = ({ remainingTime }) => {
    return (
        <div>
            <div className={Styles["start-round-container"]}>
                <div className={Styles["start-round-content"]}>{remainingTime.toLocaleString("en-us", { minimumIntegerDigits: 2 })}</div>
            </div>
        </div>
    );
};

export default WaitingTimeAnimation;
