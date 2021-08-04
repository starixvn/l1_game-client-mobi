import React, { useEffect, useRef, useState } from "react";
import { isMobileOnly, isIOS } from "react-device-detect";
import useSound from "use-sound";
import { useTheme } from "next-themes";
import appSettings from "../../common/app-settings";
import { getLocalStorageItem, localStorageKeys, storeLocalStorageItem } from "../../common/local-storage";
import { SystemContextProvider } from "../../contexts/system";
import { ViewMode } from "../shared/game-base/type";
import { WinningStreak } from "../winning-streak";
import { WinningStreakItem } from "../winning-streak/winning-streak.type";
import BigSmall from "./big-small";
import DragonTiger from "./dragon-tiger/";
import FishPrawnCrab from "./fish-prawn-crab";
import styles from "./games.module.scss";
import SeDie from "./se-die/se-die";
import KenoProMax from "./keno-pro-max";
import Baccarat from "./baccarat";
import ThreeCards from "./three-cards";
import { useTranslation } from "next-i18next";
import { GameCategoryType, Props } from "./type";
import { GameCategory } from "./constants";

const gamesInOnePageOnDesktop = 9;
let gamesOrder = [];
const gameCategories: string[] = Object.keys(GameCategoryType)
    .map((key) => GameCategoryType[key])
    .filter((value) => typeof value === "string");

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
}) => {
    const [playPlaceBetSound] = useSound("./static/sounds/place-bet.mp3");
    const [selectedCategory, setSelectedCategory] = useState<GameCategoryType>(GameCategoryType.popular);
    const [selectedPage, setSelectedPage] = useState(1);
    const winningStreakRef = useRef(null);
    const { theme } = useTheme();
    const { t } = useTranslation();
    const categoryPage = gameCategories.reduce((result, category) => {
        const categoryLength = category !== "favorite" ? GameCategory[category].length : favoriteGames.length;

        result[category] = Math.ceil(categoryLength / gamesInOnePageOnDesktop);

        return result;
    }, {});

    const setFavorite = (gameId: number, isFavorite: boolean) => {
        const favorites = getLocalStorageItem<number[]>(localStorageKeys.favoriteGames) ?? [];
        const newFavoriteList = [...favorites];
        const gameIndex = newFavoriteList.indexOf(gameId);

        gameIndex >= 0 && newFavoriteList.splice(gameIndex, 1);
        if (isFavorite) {
            newFavoriteList.push(gameId);
        }

        updateFavoriteGames(newFavoriteList);
    };

    const renderListGames = () => {
        const tabGames = selectedCategory !== GameCategoryType.favorite ? GameCategory[GameCategoryType[selectedCategory]] : favoriteGames;
        const tabFavoriteGames = favoriteGames.filter((gameId) => tabGames.includes(gameId));
        const tabUnfavoriteGames = appSettings.offeredGames.filter(
            (gameId) => !favoriteGames.includes(gameId) && tabGames.includes(gameId)
        );

        gamesOrder = tabFavoriteGames.concat(tabUnfavoriteGames);

        if (!isMobileOnly) {
            const startIndex = (selectedPage - 1) * gamesInOnePageOnDesktop;
            const renderGames = gamesOrder.slice(startIndex, startIndex + gamesInOnePageOnDesktop);

            return renderGames.map((gameId, index) => getGameComponentById(gameId, index));
        }

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
            userStakeLevel,
            updateUserStakeLevel,
        };
        switch (gameId) {
            case 2:
            case 9:
            case 22:
            case 24:
                return <SeDie key={`game-${gameId}`} {...gameProps} />;
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
    };

    const renderPagingCategory = (category: string, numOfPages: number) => {
        const result = [];

        for (let i = 0; i < numOfPages; i++) {
            result.push(
                <span onClick={() => selectCategoryPage(category, i + 1)} className={styles["category-page"]}>
                    [{i + 1}]
                </span>
            );
        }

        return result;
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
                value={{ setFavorite, favoriteGames, enabledPlaySound, gamesOrder, betSettings, updateBetSetting, userStakeLevel }}
            >
                {enabledWinningStreakNotification && <WinningStreak ref={winningStreakRef}></WinningStreak>}
                <div className={styles["game-container"]}>
                    <ul className={styles["game-category"]}>
                        {gameCategories.map((categoryKey) => (
                            <li
                                className={`${styles["category"]} ${
                                    selectedCategory === GameCategoryType[categoryKey] ? styles["selected"] : ""
                                }`}
                                key={categoryKey}
                            >
                                <div className={styles["category-text"]} onClick={() => selectCategoryPage(categoryKey, 1)}>
                                    {t(`category-${categoryKey}`)}
                                </div>
                                {!isMobileOnly &&
                                    categoryPage[categoryKey] > 1 &&
                                    renderPagingCategory(categoryKey, categoryPage[categoryKey])}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className={`${styles["game-list"]} ${styles[deviceClass]}`}>{renderListGames()}</div>
            </SystemContextProvider>
        </div>
    );
};

export default Games;
