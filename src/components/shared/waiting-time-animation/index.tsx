import React, { useEffect, useState } from "react";

import Styles from "./waiting-time-animation.module.scss";

const WaitingTimeAnimation: React.FC<{ remainingTime: number }> = (props) => {
    const [remainingTime, setRemainingTime] = useState<number>(props.remainingTime);

    useEffect(() => {
        const interval = setInterval(() => {
            setRemainingTime(remainingTime - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [remainingTime]);

    return (
        <div className={Styles["popover-container"]}>
            <div className="overlay-mask"></div>
            <div className={Styles["popover-content"]}>
                <div className={Styles["start-round"]}>Bắt đầu phiên mới</div>
                <div className={Styles["time-count-down"]}>{remainingTime.toLocaleString("en-us", { minimumIntegerDigits: 2 })}</div>
            </div>
        </div>
    );
};

export default WaitingTimeAnimation;
