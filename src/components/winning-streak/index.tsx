import { useTranslation } from "next-i18next";
import React, { forwardRef, useImperativeHandle, useState } from "react";

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

const winningStreak = {};

export const WinningStreak = forwardRef((props, ref) => {
    const { t } = useTranslation();
    const [winningStreakQueue, setWinningStreakQueue] = useState<{ [key: string]: WinningStreakItem }>({});

    useImperativeHandle(ref, () => ({
        addWinningStreak(streak: WinningStreakItem) {
            winningStreak[streak.key] = streak;

            setWinningStreakQueue({ ...winningStreak });
            console.log(winningStreakQueue);

            setTimeout(() => removeWinStreakNotification(streak.key), 3 * 1000);
        },
    }));

    const removeWinStreakNotification = (key: string) => {
        delete winningStreak[key];
        setWinningStreakQueue({ ...winningStreak });
    };

    return (
        <div className={styles["winning-streak-container"]}>
            {Object.values(winningStreakQueue).map(({ gameName, choice, streak, key }) => {
                return (
                    <div key={key} className={styles["streak-notification"]}>
                        <div className={styles["game-name"]}>{t(`${gameName.toLocaleLowerCase()}:${GameResourceKeys.GAME_NAME}`)}</div>
                        <span className={`${styles["option-icon"]} ${getIconClassName(gameName, choice)}`}>
                            {getTextOnIconChoice(gameName, choice, t)}
                        </span>
                        {`x ${streak}`}
                        <span className={`icon-close ${styles["icon-close"]}`} onClick={() => removeWinStreakNotification(key)}></span>
                    </div>
                );
            })}
        </div>
    );
});
