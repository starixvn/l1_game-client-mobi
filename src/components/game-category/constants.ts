export const GamesInOnePage = 6;

export const GameCategoryConfig = {
    popular: [22, 2, 9, 1, 4, 24, 8, 3, 7, 27, 10, 35],
    sedie: [22, 2, 9, 24],
    dice: [1, 4, 3],
    card: [7, 10, 27, 35],
};

export enum GameCategoryType {
    popular,
    favorite,
    sedie,
    dice,
    card,
}

export const GameCategoryKeys: string[] = Object.keys(GameCategoryType)
    .map((key) => GameCategoryType[key])
    .filter((value) => typeof value === "string");
