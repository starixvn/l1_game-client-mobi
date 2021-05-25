import React from "react";
import styles from "./winning-streak.module.scss";
import { WinningStreakItem } from "./winning-streak.type";

export const WinningStreak: React.FC<{ streakQueue: WinningStreakItem[] }> = ({ streakQueue }) => {
    return (
        <div className={styles["winning-streak-container"]}>
            {streakQueue.map((streakItem) => {
                return (
                    <div className={styles["streak-notification"]}>
                        <div className={styles["game-name"]}>{streakItem.gameName}</div>
                        <span className={styles["option-icon"]}>{streakItem.choice}</span>
                        {`x ${streakItem.streak}`}
                    </div>
                );
            })}
        </div>
    );
};
