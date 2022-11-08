import { AppTypes } from "../../common/constants";

import appSettings from "../../common/app-settings";

export const GamesInOnePage = 20;

export const GameCategoryConfig = {
    [AppTypes.mobile]: {
        hot: [2, 22, 9, 1, 4, 24, 8, 3, 7, 27, 10, 35],
        sedie: [2, 22, 9, 24],
        dice: [1, 4, 3],
        card: [7, 10, 27, 35],
        kenolottery: [8],
        favorite: [],
    },
    [AppTypes.megaKeno]: {
        megakeno: [52, 53, 14, 15, 16, 17, 18, 19],
        keno: [40, 41, 36, 37],
    },
};

export enum GameCategoryType {
    hot,
    megakeno,
    keno,
    sedie,
    dice,
    card,
    kenolottery,
    favorite,
}

export const favoriteGameIdIgnore = [];

export const GameCategoryKeys: string[] = Object.keys(GameCategoryType)
    .map((key) => GameCategoryType[key])
    .filter((value) => typeof value === "string" && Object.keys(GameCategoryConfig[appSettings.appType]).includes(value));
