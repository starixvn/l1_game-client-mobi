import React from "react"

export const FavoriteGameContext = React.createContext<{
    setFavorite: Function
    isFavorite: Function
}>(null)

FavoriteGameContext.displayName = "FavoriteGameContext"

export const AuthContextProvider = FavoriteGameContext.Provider
export const AuthContextConsumer = FavoriteGameContext.Consumer
export const useFavoriteGameContext = () =>
    React.useContext(FavoriteGameContext)
