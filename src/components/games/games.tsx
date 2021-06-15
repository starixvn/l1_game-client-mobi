import React, { useEffect, useRef, useState } from "react";
import { isMobileOnly } from "react-device-detect";
import useSound from "use-sound";

import appSettings from "../../common/app-settings";
import { getLocalStorageItem, localStorageKeys, storeLocalStorageItem } from "../../common/local-storage";
import { SystemContextProvider } from "../../contexts/system";
import { BetSettings } from "../bet-settings";
import { DisplayModeHint } from "../display-mode-hint";
import { ViewMode } from "../shared/game-base/type";
import { WinningStreak } from "../winning-streak";
import { WinningStreakItem } from "../winning-streak/winning-streak.type";
import BigSmall from "./big-small";
import DragonTiger from "./dragon-tiger/";
import FishPrawnCrab from "./fish-prawn-crab";
import styles from "./games.module.scss";
import SeDie from "./se-die/se-die";

const displayModeHintStorageKey = localStorageKeys.displayModeHint;
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
    const [isShowDisplayModeHint, setIsShowDisplayModeHint] = useState<boolean>(false);
    const [playPlaceBetSound] = useSound("./static/sounds/place-bet.mp3");
    const gameIdModeViewOnStorage = getLocalStorageItem<object[]>(localStorageKeys.modeViewIds);
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

        if (!gameIdModeViewOnStorage?.length) {
            const viewMode = orderedGames.map((gameId, index) => {
                if (index === 0) {
                    return { [gameId]: ViewMode.full };
                }

                return { [gameId]: ViewMode.collapse };
            });

            storeLocalStorageItem(localStorageKeys.modeViewIds, viewMode);
        }

        return orderedGames.map((gameId) => getGameComponentById(gameId));
    };

    const handleCloseHint = (e: React.MouseEvent) => {
        setIsShowDisplayModeHint(false);
    };

    const getGameComponentById = (gameId: number) => {
        const { gameSettings } = appSettings;
        const gameProps = {
            ...gameSettings[gameId],
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

        return () => {
            document.removeEventListener("scroll", showDisplayModeHint);
        };
    }, []);

    return (
        <div className="game-container game-wrapper">
            {isShowDisplayModeHint && isMobileOnly && <DisplayModeHint onCloseHint={handleCloseHint} />}
            <SystemContextProvider value={{ setFavorite, checkFavorite, betValue, enabledQuickBet, enabledPlaySound }}>
                {enabledWinningStreakNotification && <WinningStreak ref={winningStreakRef}></WinningStreak>}
                <div className={`game-list ${styles["game-list"]}`}>{renderListGames()}</div>
                <BetSettings {...betSettingProps} />
            </SystemContextProvider>
        </div>
    );
};

export default Games;
