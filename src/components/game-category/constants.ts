import { AppTypes } from "../../common/constants";
import { getAppSettings } from "../../common/app-settings";

export const GamesInOnePage = 20;

export const isMegaKenoLobby = (appType: number) => {
    return appType === 4;
};

export const GameCategoryConfig = {
    [AppTypes.mobile]: {
        hot: [3],
        dice: [3],
        favorite: [],
    },
    // [AppTypes.megaKeno]: {
    //     megakeno: [52, 53, 14, 15, 16, 17, 18, 19],
    //     keno: [40, 41, 36, 37],
    // },
    // TODO : Consider later
};

export enum GameCategoryType {
    hot,
    dice,
    favorite,
}

const SystemGameCategory = {
    ["L1"]: [GameCategoryType.hot, GameCategoryType.dice, GameCategoryType.favorite],
    ["L2"]: [GameCategoryType.hot, GameCategoryType.dice, GameCategoryType.favorite],
};

export const favoriteGameIdIgnore = []; // TODO: Consider later

export const GameCategoryKeys: string[] = SystemGameCategory[getAppSettings().system]
    .map((value) => GameCategoryType[value])
    .filter((category) => Object.keys(GameCategoryConfig[getAppSettings().appType]).includes(category));
