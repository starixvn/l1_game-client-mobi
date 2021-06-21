import React, { useEffect, useRef, useState } from "react";
import { isMobileOnly } from "react-device-detect";
import useSound from "use-sound";

import appSettings from "../../common/app-settings";
import { getLocalStorageItem, localStorageKeys, storeLocalStorageItem } from "../../common/local-storage";
import { SystemContextProvider } from "../../contexts/system";
import { BetSettings } from "../bet-settings";
import { ViewMode } from "../shared/game-base/type";
import { WinningStreak } from "../winning-streak";
import { WinningStreakItem } from "../winning-streak/winning-streak.type";
import BigSmall from "./big-small";
import DragonTiger from "./dragon-tiger/";
import FishPrawnCrab from "./fish-prawn-crab";
import styles from "./games.module.scss";
import SeDie from "./se-die/se-die";

type Props = {
    quickBetSetting?: boolean;
    enabledWinningStreakNotification: boolean;
    enabledPlaySound: boolean;
};

export const Games: React.FC<Props> = ({ quickBetSetting, enabledWinningStreakNotification, enabledPlaySound }) => {
    const favoriteGamesOnStorage = getLocalStorageItem<number[]>(localStorageKeys.favoriteGames);
    const [favoriteGames, updateFavoriteGames] = useState<number[]>(favoriteGamesOnStorage ?? []);
    const [betValue, setBetValue] = useState<number>(1);
    const [enabledQuickBet, setEnabledQuickBet] = useState<boolean>(quickBetSetting);
    const [playPlaceBetSound] = useSound("./static/sounds/place-bet.mp3");
    const winningStreakRef = useRef(null);

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
        return orderedGames.map((gameId, index) => getGameComponentById(gameId, index));
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

    useEffect(() => {
        setEnabledQuickBet(quickBetSetting);
    }, [quickBetSetting]);

    return (
        <div className="game-container game-wrapper">
            <SystemContextProvider value={{ setFavorite, checkFavorite, betValue, enabledQuickBet, enabledPlaySound }}>
                {enabledWinningStreakNotification && <WinningStreak ref={winningStreakRef}></WinningStreak>}
                <div className={`game-list ${styles["game-list"]}`}>{renderListGames()}</div>
                <BetSettings {...betSettingProps} />
            </SystemContextProvider>
        </div>
    );
};

export default Games;
