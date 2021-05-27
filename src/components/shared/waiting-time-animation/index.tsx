import React, { useEffect, useState } from "react";
import { useGameContext } from "../../../contexts/game-context/game-context";
import { ModeView } from "../game-base/type";
import Styles from "./waiting-time-animation.module.scss";

const WaitingTimeAnimation: React.FC<{ remainingTime: number }> = (props) => {
    const [remainingTime, setRemainingTime] = useState<number>(props.remainingTime);
    const { modeView } = useGameContext();

    useEffect(() => {
        const interval = setInterval(() => {
            if (remainingTime > 0) {
                setRemainingTime(remainingTime - 1);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [remainingTime]);

    return (
        <div className={`${Styles["waiting-time"]} ${modeView === ModeView.compact ? Styles["compact-mode"] : ""}`}>
            {remainingTime.toLocaleString("en-us", { minimumIntegerDigits: 2 })}
        </div>
    );
};

export default WaitingTimeAnimation;
