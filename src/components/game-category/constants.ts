export const GamesInOnePage = 6;

export const GameCategoryConfig = {
    hot: [22, 2, 9, 1, 4, 24, 3, 7, 27, 10, 35],
    sedie: [22, 2, 9, 24],
    dice: [1, 4, 3],
    keno: [8, 40, 41, 36, 37],
    card: [7, 10, 27, 35],
};

export enum GameCategoryType {
    hot,
    favorite,
    keno,
    sedie,
    dice,
    card,
}

export const favoriteGameIdIgnore = [8, 36, 37, 40, 41];

export const GameCategoryKeys: string[] = Object.keys(GameCategoryType)
    .map((key) => GameCategoryType[key])
    .filter((value) => typeof value === "string");
