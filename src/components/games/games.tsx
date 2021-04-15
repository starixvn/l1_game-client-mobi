import React, { useState } from "react";

import appSettings from "../../common/app-settings";
import * as LocalStorageManager from "../../common/local-storage";
import { FavoriteGameContext } from "../../contexts/favorite-games/favorite-games-context";
import { BetSettings } from "../bet-settings";
import BigSmall from "./big-small";
import DragonTiger from "./dragon-tiger/";
import FishPrawnCrab from "./fish-prawn-crab";
import styles from "./games.module.scss";
import SeDie from "./se-die/se-die";

export const Games: React.FC = () => {
    const storageKey = LocalStorageManager.localStorageKeys.favoriteGames;
    const favoriteGamesOnStorage = LocalStorageManager.getLocalStorageItem<number[]>(storageKey);

    const [favoriteGames, updateFavoriteGames] = useState<number[]>(favoriteGamesOnStorage ?? []);

    const isFavorite = (gameId) => favoriteGames.includes(gameId);

    const setFavorite = (gameId: number, isFavorite: boolean) => {
        const newFavoriteList = [...favoriteGames];
        const gameIndex = newFavoriteList.indexOf(gameId);

        gameIndex >= 0 && newFavoriteList.splice(gameIndex, 1);
        isFavorite && newFavoriteList.unshift(gameId);

        updateFavoriteGames(newFavoriteList);
        LocalStorageManager.storeLocalStorageItem(storageKey, newFavoriteList);
    };

    const renderListGames = () => {
        const unfavoriteGames = appSettings.offeredGames.filter((gameId) => !favoriteGames.includes(gameId));

        const orderedGames = favoriteGames.concat(unfavoriteGames);

        return orderedGames.map((gameId) => getGameComponentById(gameId));
    };

    const getGameComponentById = (gameId: number) => {
        const { gameConfigs } = appSettings;
        const gameProps = gameConfigs[gameId];
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

    const favoriteGameContextValue = {
        setFavorite: (gameId, isFavorite) => setFavorite(gameId, isFavorite),
        isFavorite: (gameId) => isFavorite(gameId),
    };

    return (
        <div className="game-container">
            <FavoriteGameContext.Provider value={favoriteGameContextValue}>
                <div className={styles["game-list"]}>{renderListGames()}</div>
                <div className={styles["bet-settings"]}>
                    <BetSettings />
                </div>
            </FavoriteGameContext.Provider>
        </div>
    );
};

export default Games;
