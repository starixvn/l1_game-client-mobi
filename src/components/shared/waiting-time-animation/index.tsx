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

    return <div className={Styles["mini-notice"]}>{remainingTime.toLocaleString("en-us", { minimumIntegerDigits: 2 })}</div>;
};

export default WaitingTimeAnimation;
