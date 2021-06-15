import React, { useEffect, useState } from "react";
import { useGameContext } from "../../../contexts/game-context/game-context";
import { ViewMode } from "../game-base/type";
import Styles from "./waiting-time-animation.module.scss";

const WaitingTimeAnimation: React.FC<{ remainingTime: number }> = (props) => {
    const [remainingTime, setRemainingTime] = useState<number>(props.remainingTime);
    const { viewMode } = useGameContext();

    useEffect(() => {
        const interval = setInterval(() => {
            if (remainingTime > 0) {
                setRemainingTime(remainingTime - 1);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [remainingTime]);

    return (
        <div className={`${Styles["waiting-time"]} ${viewMode === ViewMode.simple ? Styles["simple-mode"] : ""}`}>
            {remainingTime.toLocaleString("en-us", { minimumIntegerDigits: 2 })}
        </div>
    );
};

export default WaitingTimeAnimation;
