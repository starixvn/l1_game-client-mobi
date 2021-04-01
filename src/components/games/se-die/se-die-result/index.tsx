import React from "react";
import styles from "./se-die-result.module.scss";
import { Props } from "./se-die-result";
import { GameState } from "../../../shared/game-base/type";

const SeDieResult: React.FC<Props> = (props) => {
    const result = props.result ? Object.values(props.result) : [];
    const currentState = props.gameState;

    const generateResult = (result: boolean[]) => {
        return result.map((value, index) => (
            <div key={`dot-${index + 1}`} className={`${styles[`flipResult-sedie-dot${index + 1}`]} ${styles["flipResult-sedie-dot"]}`}>
                <div className={`${value ? styles["result-dot-red"] : styles["result-dot-white"]}`}></div>
            </div>
        ));
    };

    const getClassNameByGameState = (gameState: GameState) => {
        switch (gameState) {
            case GameState.BeforeStartRound:
                return "shake-the-plate";
            case GameState.DisplayResult:
                return "open-the-plate";
            default:
                return "";
        }
    };

    return (
        <div className={`${styles["container"]} ${styles[getClassNameByGameState(currentState)]}`}>
            <div className={styles["flipResult-overlay-black"]}>
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

export default SeDieResult;
