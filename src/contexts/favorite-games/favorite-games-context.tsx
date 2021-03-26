import React from "react";

export const FavoriteGameContext = React.createContext<{
    setFavorite: Function;
    isFavorite: Function;
}>(null);

FavoriteGameContext.displayName = "FavoriteGameContext";

export const FavoriteContextProvider = FavoriteGameContext.Provider;
export const FavoriteContextConsumer = FavoriteGameContext.Consumer;
export const useFavoriteGameContext = () => React.useContext(FavoriteGameContext);
