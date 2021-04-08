import React from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

import styles from "./countdown-timer.module.scss";

type Props = {
    remainingTime: number;
};

const CountdownTimer: React.FC<Props> = (props) => (
    <div className={styles.timer}>
        <CountdownCircleTimer
            isPlaying
            size={40}
            strokeWidth={4}
            trailStrokeWidth={2}
            trailColor="#fff"
            duration={props.remainingTime}
            colors="#fff"
        >
            {({ remainingTime }) => remainingTime}
        </CountdownCircleTimer>
    </div>
);

export default CountdownTimer;
