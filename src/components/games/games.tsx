import { useTheme } from "next-themes";
import React, { useEffect, useRef, useState } from "react";
import { isIOS, isMobileOnly } from "react-device-detect";
import { io, Socket } from "socket.io-client";
import useSound from "use-sound";

import appSettings from "../../common/app-settings";
import { getLocalStorageItem, localStorageKeys } from "../../common/local-storage";
import { SystemContextProvider } from "../../contexts/system";
import { SocketState } from "../../types";
import { GameCategory } from "../game-category";
import { GameCategoryConfig, GameCategoryKeys, GameCategoryType, GamesInOnePage } from "../game-category/constants";
import { ViewMode } from "../shared/game-base/type";
import { WinningStreak } from "../winning-streak";
import { WinningStreakItem } from "../winning-streak/winning-streak.type";
import Baccarat from "./baccarat";
import BigSmall from "./big-small";
import DragonTiger from "./dragon-tiger/";
import FishPrawnCrab from "./fish-prawn-crab";
import styles from "./games.module.scss";
import KenoProMax from "./keno-pro-max";
import MiniSeDie from "./mini-sedie";
import SeDie from "./se-die/se-die";
import SpecialSeDie from "./special-sedie";
import ThreeCards from "./three-cards";
import { Props } from "./type";
import { GameCategoryConfig, GameCategoryKeys, GameCategoryType, GamesInOnePage } from "../game-category/constants";
import { GameCategory } from "../game-category";
import { FavoriteGuide } from "../favorite-guide";

let gamesOrder = [];

const getRenderGames = (selectedCategory: GameCategoryType, selectedPage: number, favoriteGames: number[]) => {
    const tabGames =
        selectedCategory !== GameCategoryType.favorite ? GameCategoryConfig[GameCategoryType[selectedCategory]] : favoriteGames;
    const tabFavoriteGames = favoriteGames.filter((gameId) => tabGames.includes(gameId));
    const tabUnfavoriteGames = appSettings.offeredGames.filter((gameId) => !favoriteGames.includes(gameId) && tabGames.includes(gameId));

    gamesOrder = tabFavoriteGames.concat(tabUnfavoriteGames);
    const startIndex = gamesOrder.length > (selectedPage - 1) * GamesInOnePage ? (selectedPage - 1) * GamesInOnePage : 0;

    return gamesOrder.slice(startIndex, startIndex + GamesInOnePage);
};

const getCategoryByGameId = (gameId: number) => {
    return GameCategoryKeys.find((category) => GameCategoryConfig[category] && GameCategoryConfig[category].includes(gameId)) ?? "popular";
};

const getCategoryHashTag = (category: string, pageIndex: number) => {
    return pageIndex > 1 ? `${category}_${pageIndex - 1}` : category;
};

const getUpdatedFavoriteList = (gameId: number, isFavorite: boolean) => {
    const favorites = getLocalStorageItem<number[]>(localStorageKeys.favoriteGames) ?? [];
    const newFavoriteList = [...favorites];
    const gameIndex = newFavoriteList.indexOf(gameId);

    gameIndex >= 0 && newFavoriteList.splice(gameIndex, 1);

    isFavorite && newFavoriteList.push(gameId);

    return newFavoriteList;
};

export const Games: React.FC<Props> = ({
    enabledWinningStreakNotification,
    enabledPlaySound,
    setApiErrorMessage,
    betSettings,
    updateBetSetting,
    userStakeLevel,
    updateUserStakeLevel,
    updateFavoriteGames,
    favoriteGames,
    queryGame,
}) => {
    const [playPlaceBetSound] = useSound("./static/sounds/place-bet.mp3");
    const urlHashtag = window.location.hash.replace("#", "").split("_");
    const queryCategory = urlHashtag[0] || getCategoryByGameId(queryGame);
    const [selectedCategory, setSelectedCategory] = useState<GameCategoryType>(GameCategoryType[queryCategory]);
    const [selectedPage, setSelectedPage] = useState(+urlHashtag[1] + 1 || 1);
    const winningStreakRef = useRef(null);
    const { theme } = useTheme();
    history.pushState(null, "", `#${getCategoryHashTag(queryCategory, selectedPage)}`);
    const socketGatewayRef = useRef<Socket>(null);
    const [socketState, setSocketState] = useState<SocketState>(SocketState.None);

    const setFavorite = (gameId: number, isFavorite: boolean) => {
        const newFavoriteList = getUpdatedFavoriteList(gameId, isFavorite);

        updateFavoriteGames(newFavoriteList);
    };

    const renderListGames = () => {
        const renderGames = getRenderGames(selectedCategory, selectedPage, favoriteGames);

        return renderGames.length === 0 && selectedCategory === GameCategoryType.favorite ? (
            <FavoriteGuide />
        ) : (
            renderGames.map((gameId, index) => getGameComponentById(gameId, index))
        );
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
            userStakeLevel,
            updateUserStakeLevel,
            socketGateway: socketGatewayRef.current,
            socketGatewayState: socketState,
            retryConnectSocket: connectSocket,
        };
        switch (gameId) {
            case 2:
            case 22:
                return <SeDie key={`game-${gameId}`} {...gameProps} />;
            case 9:
                return <MiniSeDie key={`game-${gameId}`} {...gameProps} />;
            case 24:
                return <SpecialSeDie key={`game-${gameId}`} {...gameProps} />;
            case 3:
                return <FishPrawnCrab key={`game-${gameId}`} {...gameProps} />;
            case 7:
                return <DragonTiger key={`game-${gameId}`} {...gameProps} />;
            case 8:
                return <KenoProMax key={`game-${gameId}`} {...gameProps} />;
            case 10:
            case 27:
                return <Baccarat key={`game-${gameId}`} {...gameProps} />;
            case 1:
            case 4:
                return <BigSmall key={`game-${gameId}`} {...gameProps} />;
            case 35:
                return <ThreeCards key={`game-${gameId}`} {...gameProps} />;
            default:
                return null;
        }
    };

    const selectCategoryPage = (category: string, pageIndex: number) => {
        setSelectedCategory(GameCategoryType[category]);
        setSelectedPage(pageIndex);
        history.pushState(null, "", `#${getCategoryHashTag(category, pageIndex)}`);
    };

    const connectSocket = () => {
        console.log("connectSocket");
        const socket = io(appSettings.socketGatewayUri, { forceNew: true, transports: ["websocket"], upgrade: false });
        socket.on("connect", () => {
            setSocketState(SocketState.Connected);
        });
        socket.on("connect_error", () => {
            setSocketState(SocketState.Error);
        });
        socket.on("disconnect", (reason) => {
            setSocketState(SocketState.Disconnected);
            console.log(reason);
        });

        socketGatewayRef.current = socket;
    };

    useEffect(() => {
        const onVisibilityChange = () => {
            if (document.visibilityState === "visible" && socketGatewayRef.current && !socketGatewayRef.current.connected) {
                connectSocket();
            }
        };

        connectSocket();
        document.addEventListener("visibilitychange", onVisibilityChange);

        return () => {
            socketGatewayRef.current.close();
            document.removeEventListener("visibilitychange", onVisibilityChange);
        };
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className={`game-container ${!isMobileOnly ? "game-wrapper" : ""} `}>
            <SystemContextProvider
                value={{ setFavorite, favoriteGames, enabledPlaySound, gamesOrder, betSettings, updateBetSetting, userStakeLevel }}
            >
                {enabledWinningStreakNotification && <WinningStreak ref={winningStreakRef}></WinningStreak>}
                <GameCategory
                    favoriteGames={favoriteGames}
                    selectedPage={selectedPage}
                    selectCategoryPage={selectCategoryPage}
                    selectedCategory={selectedCategory}
                />
                <div className={`${styles["game-list"]} ${isMobileOnly ? styles[isIOS ? "ios-device" : "android-device"] : ""}`}>
                    {renderListGames()}
                </div>
            </SystemContextProvider>
        </div>
    );
};

export default Games;
