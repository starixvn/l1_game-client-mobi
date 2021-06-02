import React from "react";
import { useTranslation } from "react-i18next";
import { GameResourceKeys } from "../../common/resources";
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

const GamesHaveNoTextOnIcon = ["baucua", "xocxoc", "vipsedie"];

const getIconClassName = (gameName: string, choice: string) => {
    if (gameName.toLocaleLowerCase() === "baucua") {
        return `${styles.dice} ${BauCuaIconMapper[choice]}`;
    }

    return `${styles[`dot-${choice}`]}`;
};

const getTextOnIconChoice = (gameName: string, choice: string, translate: Function) => {
    const gameNameLowerCase = gameName.toLocaleLowerCase();
    if (GamesHaveNoTextOnIcon.includes(gameNameLowerCase)) {
        return "";
    }

    return translate(`${gameNameLowerCase}:${choice}TextDot`);
};

export const WinningStreak: React.FC<{ streakQueue: { [key: string]: WinningStreakItem } }> = ({ streakQueue }) => {
    const { t } = useTranslation();

    return (
        <div className={styles["winning-streak-container"]}>
            {Object.values(streakQueue).map(({ gameName, choice, streak }, index) => {
                return (
                    <div key={index} className={styles["streak-notification"]}>
                        <div className={styles["game-name"]}>{t(`${gameName.toLocaleLowerCase()}:${GameResourceKeys.GAME_NAME}`)}</div>
                        <span className={`${styles["option-icon"]} ${getIconClassName(gameName, choice)}`}>
                            {getTextOnIconChoice(gameName, choice, t)}
                        </span>
                        {`x ${streak}`}
                    </div>
                );
            })}
        </div>
    );
};
