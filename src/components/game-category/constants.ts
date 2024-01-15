import { AppTypes } from "../../common/constants";
import { getAppSettings } from "../../common/app-settings";

export const GamesInOnePage = 20;

export const GameCategoryConfig = {
    [AppTypes.mobile]: {
        hot: [3],
        dice: [3],
        favorite: [3],
        newNumberGames: [1111, 1112, 1113, 1114, 1115, 1116],
    },
};

export enum GameCategoryType {
    hot,
    dice,
    favorite,
    newNumberGames,
}

const SystemGameCategory = {
    ["L1"]: [GameCategoryType.hot, GameCategoryType.dice, GameCategoryType.favorite, GameCategoryType.newNumberGames],
    ["L2"]: [GameCategoryType.hot, GameCategoryType.dice, GameCategoryType.favorite, GameCategoryType.newNumberGames],
};

export const favoriteGameIdIgnore = []; // TODO: Consider later

export const GameCategoryKeys: string[] = SystemGameCategory[getAppSettings().system]
    .map((value) => GameCategoryType[value])
    .filter((category) => Object.keys(GameCategoryConfig[getAppSettings().appType]).includes(category));
