import React from 'react';
import Styles from "./promotion-tournament.module.scss";

const LoadingSpinner = () => {
    return <div className={Styles["game-over-layer"]}>
        <div className={Styles["spinner-container"]} >
            <div className={Styles["loader"]}></div>
        </div>
    </div>
};

export default LoadingSpinner;