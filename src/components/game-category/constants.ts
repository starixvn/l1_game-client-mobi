import { AppTypes } from "../../common/constants";

import { getAppSettings } from "../../common/app-settings";

export const GamesInOnePage = 20;

export const isMegaKenoLobby = (appType: number) => {
    return appType === 4;
};

export const GameCategoryConfig = {
    [AppTypes.mobile]: {
        hot: [2, 22, 9, 1, 4, 24, 8, 3, 7, 27, 10, 35],
        sedie: [2, 22, 9, 24],
        dice: [1, 4, 3],
        card: [7, 10, 27, 35],
        kenolottery: [8],
        megakeno: [52, 53, 14, 15, 16, 17, 18, 19],
        keno: [40, 41, 36, 37],
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

const SystemGameCategory = {
    ["L1"]: [
        GameCategoryType.hot,
        GameCategoryType.sedie,
        GameCategoryType.dice,
        GameCategoryType.card,
        isMegaKenoLobby(getAppSettings().appType) && GameCategoryType.megakeno,
        isMegaKenoLobby(getAppSettings().appType) && GameCategoryType.keno,
        GameCategoryType.kenolottery,
        GameCategoryType.favorite,
    ],
    ["L2"]: [
        GameCategoryType.hot,
        GameCategoryType.sedie,
        GameCategoryType.dice,
        GameCategoryType.card,
        GameCategoryType.megakeno,
        GameCategoryType.keno,
        GameCategoryType.kenolottery,
        GameCategoryType.favorite,
    ],
};

export const favoriteGameIdIgnore = [40, 41, 36, 37];

export const GameCategoryKeys: string[] = SystemGameCategory[getAppSettings().system]
    .map((value) => GameCategoryType[value])
    .filter((category) => Object.keys(GameCategoryConfig[getAppSettings().appType]).includes(category));
