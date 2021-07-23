import React, { useEffect, useRef, useState } from "react";
import { isMobileOnly, isIOS } from "react-device-detect";
import useSound from "use-sound";
import { useTheme } from "next-themes";
import appSettings from "../../common/app-settings";
import { getLocalStorageItem, localStorageKeys, storeLocalStorageItem } from "../../common/local-storage";
import { SystemContextProvider } from "../../contexts/system";
import { BetSettingStorage } from "../shared/bet-settings/type";
import { UserStakeLevel, ViewMode } from "../shared/game-base/type";
import { WinningStreak } from "../winning-streak";
import { WinningStreakItem } from "../winning-streak/winning-streak.type";
import BigSmall from "./big-small";
import DragonTiger from "./dragon-tiger/";
import FishPrawnCrab from "./fish-prawn-crab";
import styles from "./games.module.scss";
import SeDie from "./se-die/se-die";

type Props = {
    enabledWinningStreakNotification: boolean;
    enabledPlaySound: boolean;
    setApiErrorMessage: Function;
    updateBetSetting: Function;
    betSettings: BetSettingStorage;
    userStakeLevel: UserStakeLevel;
};

let gamesOrder = [];

export const Games: React.FC<Props> = ({
    enabledWinningStreakNotification,
    enabledPlaySound,
    setApiErrorMessage,
    betSettings,
    updateBetSetting,
    userStakeLevel,
}) => {
    const favoriteGamesOnStorage = getLocalStorageItem<number[]>(localStorageKeys.favoriteGames);
    const [favoriteGames, updateFavoriteGames] = useState<number[]>(favoriteGamesOnStorage ?? []);
    const [playPlaceBetSound] = useSound("./static/sounds/place-bet.mp3");
    const winningStreakRef = useRef(null);
    const { theme } = useTheme();
    const checkFavorite = (gameId: number) => favoriteGames.includes(gameId);

    const setFavorite = (gameId: number, isFavorite: boolean) => {
        const favorites = getLocalStorageItem<number[]>(localStorageKeys.favoriteGames) ?? [];
        const newFavoriteList = [...favorites];
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
        gamesOrder = favoriteGames.concat(unfavoriteGames);
        return gamesOrder.map((gameId, index) => getGameComponentById(gameId, index));
    };

    const getGameComponentById = (gameId: number, index: number) => {
        const { gameSettings } = appSettings;
        const viewMode = isMobileOnly && index !== 0 ? ViewMode.collapse : ViewMode.full;
        const gameProps = {
            ...gameSettings[gameId],
            viewMode,
            notifyWinStreak: (winningStreak: WinningStreakItem) =>
                enabledWinningStreakNotification && winningStreakRef?.current && winningStreakRef.current.addWinningStreak(winningStreak),
            playPlaceBetSound: () => enabledPlaySound && playPlaceBetSound(),
            setApiErrorMessage: setApiErrorMessage,
            theme,
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

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    var deviceClass = "";
    if (isMobileOnly) {
        deviceClass = isIOS ? "ios-device" : "android-device";
    }

    return (
        <div className={`game-container ${!isMobileOnly ? "game-wrapper" : ""} `}>
            <SystemContextProvider
                value={{ setFavorite, checkFavorite, enabledPlaySound, gamesOrder, betSettings, updateBetSetting, userStakeLevel }}
            >
                {enabledWinningStreakNotification && <WinningStreak ref={winningStreakRef}></WinningStreak>}
                <div className={`${styles["game-list"]} ${styles[deviceClass]}`}>{renderListGames()}</div>
            </SystemContextProvider>
        </div>
    );
};

export default Games;
