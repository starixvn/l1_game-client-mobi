import React from "react";

import Styles from "./waiting-time-animation.module.scss";

const WaitingTimeAnimation: React.FC<{ remainingTime: number }> = ({ remainingTime }) => {
    return (
        <div className={Styles["popover-container"]}>
            <div className="overlay-mask"></div>
            <div className={Styles["popover-content"]}>
                <div className={Styles["start-round"]}>Bắt đầu phiên mới</div>
                <div className={Styles["time-count-down"]}>{(remainingTime - 1).toLocaleString("en-us", { minimumIntegerDigits: 2 })}</div>
            </div>
        </div>
    );
};

export default WaitingTimeAnimation;
