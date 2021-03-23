import React, { useState } from "react";

import * as LocalStorageManager from "../../common/local-storage/local-storage-manager";
import appSettings from "../../common/app-settings";
import { FavoriteGameContext } from "../contexts/favorite-games/favorite-games-context";
import BigSmall from "./big-small/big-small";
import styles from "./games.module.scss";
import KenoProMax from "./keno-pro-max/keno-pro-max";
import SeDie from "./se-die/se-die";

export const Games: React.FC = () => {
    const storageKey = LocalStorageManager.localStorageKeys.favoriteGames;
    const favoriteGamesOnStorage = LocalStorageManager.getLocalStorageItem<number[]>(storageKey);

    const games = [2, 8, 1];
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
        const unfavoriteGames = games.filter((gameId) => !favoriteGames.includes(gameId));

        const orderedGames = favoriteGames.concat(unfavoriteGames);

        return orderedGames.map((gameId) => getGameComponentById(gameId));
    };

    const getGameComponentById = (gameId: number) => {
        switch (gameId) {
            case 2:
                return <SeDie key={gameId} {...appSettings.seDie} />;
            case 8:
                return <KenoProMax key={gameId} {...appSettings.kenoProMax} />;
            case 1:
                return <BigSmall key={gameId} {...appSettings.bigSmall} />;
            default:
                return null;
        }
    };

    const favoriteGameContextValue = {
        setFavorite: (gameId, isFavorite) => setFavorite(gameId, isFavorite),
        isFavorite: (gameId) => isFavorite(gameId),
    };

    return (
        <FavoriteGameContext.Provider value={favoriteGameContextValue}>
            <div className={styles["game-list"]}>{renderListGames()}</div>
        </FavoriteGameContext.Provider>
    );
};

export default Games;
