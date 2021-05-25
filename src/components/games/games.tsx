import React, { useState, useEffect } from "react";
import { isMobileOnly } from "react-device-detect";

import appSettings from "../../common/app-settings";
import { getLocalStorageItem, localStorageKeys, storeLocalStorageItem } from "../../common/local-storage";
import { SystemContextProvider } from "../../contexts/system";
import { BetSettings } from "../bet-settings";
import { DisplayModeHint } from "../display-mode-hint";
import { WinningStreak } from "../winning-streak";
import { WinningStreakItem } from "../winning-streak/winning-streak.type";
import BigSmall from "./big-small";
import DragonTiger from "./dragon-tiger/";
import FishPrawnCrab from "./fish-prawn-crab";
import styles from "./games.module.scss";
import SeDie from "./se-die/se-die";

const displayModeHintStorageKey = localStorageKeys.displayModeHint;

export const Games: React.FC<{ quickBetSetting?: boolean }> = ({ quickBetSetting }) => {
    const favoriteGamesOnStorage = getLocalStorageItem<number[]>(localStorageKeys.favoriteGames);
    const [favoriteGames, updateFavoriteGames] = useState<number[]>(favoriteGamesOnStorage ?? []);
    const [betValue, setBetValue] = useState<number>(1);
    const [enabledQuickBet, setEnabledQuickBet] = useState<boolean>(quickBetSetting);
    const [isShowDisplayModeHint, setIsShowDisplayModeHint] = useState<boolean>(false);
    const [winningStreakQueue, setWinningStreakQueue] = useState<Array<WinningStreakItem>>([]);

    const addWinningStreak = (streak: WinningStreakItem) => {
        winningStreakQueue.push(streak);

        setWinningStreakQueue([...winningStreakQueue]);
    };

    const checkFavorite = (gameId: number) => favoriteGames.includes(gameId);

    const setFavorite = (gameId: number, isFavorite: boolean) => {
        const newFavoriteList = [...favoriteGames];
        const gameIndex = newFavoriteList.indexOf(gameId);

        gameIndex >= 0 && newFavoriteList.splice(gameIndex, 1);
        if (isFavorite) {
            newFavoriteList.unshift(gameId);
            window.scrollTo(0, 0);
        }

        updateFavoriteGames(newFavoriteList);
        storeLocalStorageItem(localStorageKeys.favoriteGames, newFavoriteList);
    };

    const unfavoriteGames = appSettings.offeredGames.filter((gameId) => !favoriteGames.includes(gameId));

    const renderListGames = () => {
        const orderedGames = favoriteGames.concat(unfavoriteGames);

        return orderedGames.map((gameId) => getGameComponentById(gameId));
    };

    const handleCloseHint = (e: React.MouseEvent) => {
        setIsShowDisplayModeHint(false);
    };

    const getGameComponentById = (gameId: number) => {
        const { gameSettings } = appSettings;
        const gameProps = {
            ...gameSettings[gameId],
            notifyWinStreak: (winningStreak: WinningStreakItem) => addWinningStreak(winningStreak),
        };
        switch (gameId) {
            case 2:
            case 22:
                return <SeDie key={`game-${gameId}`} {...gameProps} />;
            case 3:
                return <FishPrawnCrab key={`game-${gameId}`} {...gameProps} />;
            case 7:
                return <DragonTiger key={`game-${gameId}`} {...gameProps} />;
            case 1:
            case 4:
                return <BigSmall key={`game-${gameId}`} {...gameProps} />;
            default:
                return null;
        }
    };

    const betSettingProps = {
        betValue,
        updateBetValue: setBetValue,
        enabledQuickBet,
        updateEnabledQuickBet: setEnabledQuickBet,
    };

    const showDisplayModeHint = () => {
        const showDisplayModeHintStorage = getLocalStorageItem<boolean>(displayModeHintStorageKey);
        !showDisplayModeHintStorage && setIsShowDisplayModeHint(true);
    };

    useEffect(() => {
        setEnabledQuickBet(quickBetSetting);
    }, [quickBetSetting]);

    useEffect(() => {
        const showDisplayModeHintStorage = getLocalStorageItem<boolean>(displayModeHintStorageKey);

        !showDisplayModeHintStorage && document.addEventListener("scroll", showDisplayModeHint);
        
        const interval = setInterval(() => {
            winningStreakQueue.unshift();

            setWinningStreakQueue(winningStreakQueue);
        }, 3 * 1000);

        return () => {
            document.removeEventListener("scroll", showDisplayModeHint);
            clearInterval(interval);
        };
    }, []);

    return (
        <div className="game-container game-wrapper">
            {isMobileOnly && isShowDisplayModeHint && <DisplayModeHint onCloseHint={handleCloseHint} />}
            <SystemContextProvider value={{ setFavorite, checkFavorite, betValue, enabledQuickBet }}>
                <WinningStreak streakQueue={winningStreakQueue}></WinningStreak>
                <div className={`game-list ${styles["game-list"]}`}>{renderListGames()}</div>
                <BetSettings {...betSettingProps} />
            </SystemContextProvider>
        </div>
    );
};

export default Games;
