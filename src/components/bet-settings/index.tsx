import React, { useState } from "react";
import styles from "./styles.module.scss";

export const BetSettings: React.FC = (props) => {
    const [isShowSettings, setShowSettings] = useState(false);

    const HandleClickActiveBtn = () => {
        setShowSettings(!isShowSettings);
    };

    return (
        <div className={styles.container}>
            <div className={styles["active-btn"]} onClick={HandleClickActiveBtn}>
                Click me
            </div>
            {isShowSettings && (
                <div className={styles["settings-container"]}>
                    <input className={styles["quick-bet-checkbox"]} type={"checkbox"} value={"Quick Bet"}></input>
                    <div className={styles["chips-container"]}>
                        <div className={styles.chip}>0</div>
                        <div className={styles.chip}>10</div>
                        <div className={styles.chip}>50</div>
                        <div className={styles.chip}>500</div>
                        <div className={styles.chip}>2000</div>
                    </div>
                </div>
            )}
        </div>
    );
};
