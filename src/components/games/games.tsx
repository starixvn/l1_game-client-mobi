import React, { useState } from "react"

import appSettings from "../../common/app-settings"
import { FavoriteGameContext } from "../contexts/favorite-games/favorite-games-context"
import BigSmall from "./big-small/big-small"
import styles from "./games.module.scss"
import KenoProMax from "./keno-pro-max/keno-pro-max"
import SeDie from "./se-die/se-die"

export const Games: React.FC = () => {
    const games = [2, 8, 1]
    const [favoriteGames, updateFavoriteGames] = useState<number[]>([])

    const isFavorite = (gameId) => favoriteGames.includes(gameId)

    const setFavorite = (gameId: number, isFavorite: boolean) => {
        const gameIndex = favoriteGames.indexOf(gameId)

        gameIndex && favoriteGames.slice(gameIndex, 1)
        isFavorite && favoriteGames.unshift(gameId)

        updateFavoriteGames(favoriteGames)
    }

    const renderListGames = () => {
        const unfavoriteGames = games.filter(
            (gameId) => !favoriteGames.includes(gameId)
        )

        const orderedGames = favoriteGames.concat(unfavoriteGames)

        return orderedGames.map((gameId) => getGameComponentById(gameId))
    }

    const getGameComponentById = (gameId: number) => {
        switch (gameId) {
            case 2:
                return <SeDie {...appSettings.seDie} />
            case 8:
                return <KenoProMax {...appSettings.kenoProMax} />
            case 1:
                return <BigSmall {...appSettings.bigSmall} />
            default:
                return null
        }
    }

    const favoriteGameContextValue = {
        setFavorite: (gameId, isFavorite) => setFavorite(gameId, isFavorite),
        isFavorite: (gameId) => isFavorite(gameId),
    }

    return (
        <FavoriteGameContext.Provider value={favoriteGameContextValue}>
            <div className={styles["game-list"]}>{renderListGames()}</div>
        </FavoriteGameContext.Provider>
    )
}

export default Games
