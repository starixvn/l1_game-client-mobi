import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./winning-streak.module.scss";
import { WinningStreakItem } from "./winning-streak.type";

const BauCuaIconMapper = {
    fish: "icon-ca",
    prawn: "icon-tom",
    crab: "icon-cua",
    stag: "icon-nai",
    gourd: "icon-bau",
    rooster: "icon-ga",
};

const getIconClassName = (gameName: string, choice: string) => {
    if (gameName.toLocaleLowerCase() === "baucua") {
        return `${styles.dice} ${BauCuaIconMapper[choice]}`;
    }

    return `${styles["dot-" + choice]}`;
};

export const WinningStreak: React.FC<{ streakQueue: WinningStreakItem[] }> = ({ streakQueue }) => {
    const { t } = useTranslation("common");

    return (
        <div className={styles["winning-streak-container"]}>
            {streakQueue.map((streakItem) => {
                return (
                    <div className={styles["streak-notification"]}>
                        <div className={styles["game-name"]}>{t(streakItem.gameName.toLocaleLowerCase())}</div>
                        <span className={`${styles["option-icon"]} ${getIconClassName(streakItem.gameName, streakItem.choice)}`}></span>
                        {`x ${streakItem.streak}`}
                    </div>
                );
            })}
        </div>
    );
};
