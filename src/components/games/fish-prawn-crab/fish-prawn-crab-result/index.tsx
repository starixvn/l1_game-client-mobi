import React from "react";
import styles from "./styles.module.scss";
import { Props } from "./type";

const FishPrawnCrabResult: React.FC<Props> = (props) => {
    const result = props.result ? Object.values(props.result) : [];

    const generateResult = (result: boolean[]) => {
        return result.map((value, index) => (
            <div key={`dot-${index + 1}`} className={`${styles[`flipResult-sedie-dot${index + 1}`]} ${styles["flipResult-sedie-dot"]}`}>
                <div className={`${value ? styles["result-dot-red"] : styles["result-dot-white"]}`}></div>
            </div>
        ));
    };

    return (
        <div className={`${styles["container"]} ${styles["show-result"]}`}>
            <div className="overlay-mask">
                <div className={styles["flipResult-sedie-fadeOutDelay"]}>
                    <div className={`${styles["flipResult-sedie-container"]} ${styles["flipResult-fadeIn-animation"]}`}>
                        <div className={styles["flipResult-sedie-set"]}>
                            <div className={styles["flipResult-sedie-plate"]}></div>
                            {generateResult(result)}
                            <div className={styles["flipResult-sedie-bowl"]}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FishPrawnCrabResult;
