import React from "react";

import { Result } from "../sedie";
import styles from "./sedie-animations.module.scss";

const Plate: React.FC = ({ children }) => (
    <div className="overlay-mask">
        <div className={styles["result-sedie-fadeOutDelay"]}>
            <div className={`${styles["result-sedie-container"]} ${styles["result-fadeIn-animation"]}`}>
                <div className={styles["result-sedie-set"]}>
                    <div className={styles["result-sedie-plate"]}></div>
                    {children}
                    <div className={styles["result-sedie-bowl"]}></div>
                </div>
            </div>
        </div>
    </div>
);

export const ShakeThePlate = () => (
    <div className={styles["shake-the-plate"]}>
        <Plate />
    </div>
);

type Props = {
    result: Result;
};

export const OpenThePlate: React.FC<Props> = ({ result }) => (
    <div className={styles["open-the-plate"]}>
        <Plate>
            {Object.values(result).map((value, index) => (
                <div key={index} className={`${styles[`result-sedie-dot${index + 1}`]} ${styles["result-sedie-dot"]}`}>
                    <div className={`${value ? styles["result-dot-red"] : styles["result-dot-white"]}`}></div>
                </div>
            ))}
        </Plate>
    </div>
);
