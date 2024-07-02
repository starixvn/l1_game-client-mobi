import { getAppSettings } from "../../common/app-settings";
import { GameIds } from "../../common/constants/gameIds";

export const GamesInOnePage = 20;

export const isMegaKenoLobby = () => {
    return getAppSettings().appType === 4;
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

const Categories = {
    hot: "hot",
    sedie: "sedie",
    dice: "dice",
    card: "card",
    kenolottery: "kenolottery",
    megakeno: "megakeno",
    keno: "keno",
    favorite: "favorite",
};

const KenoCategoryConfig = {
    [Categories.megakeno]: [
        GameIds.MegaKeno,
        GameIds.MegaKeno2,
        GameIds.KenoMini,
        GameIds.KenoMini2,
        GameIds.KenoEast,
        GameIds.KenoWest,
        GameIds.KenoSouth,
        GameIds.KenoNorth,
    ],
    [Categories.keno]: [GameIds.KenoPower1, GameIds.KenoPower2, GameIds.KenoSoccer, GameIds.KenoSoccer2],
};

const GrUSDCategoryConfig = {
    [Categories.hot]: [
        GameIds.SeDie,
        GameIds.VipSeDie,
        GameIds.MiniSeDie,
        GameIds.BigSmall,
        GameIds.BigSmallTurbo,
        GameIds.SpecialSeDie,
        GameIds.KenoProMax,
        GameIds.FishPrawnCrab,
        GameIds.DragonTiger,
        GameIds.VipBaccarat,
        GameIds.Baccarat,
        GameIds.ThreeCards,
    ],
    [Categories.sedie]: [GameIds.SeDie, GameIds.VipSeDie, GameIds.MiniSeDie, GameIds.SpecialSeDie],
    [Categories.dice]: [GameIds.BigSmall, GameIds.BigSmallTurbo, GameIds.FishPrawnCrab],
    [Categories.card]: [GameIds.DragonTiger, GameIds.VipBaccarat, GameIds.Baccarat, GameIds.ThreeCards],
    [Categories.kenolottery]: [GameIds.KenoProMax],
    [Categories.favorite]: [],
};

const OtherCurrencyGroupCategoryConfig = {
    [Categories.hot]: [
        GameIds.Baccarat,
        GameIds.VipBaccarat,
        GameIds.DragonTiger,
        GameIds.ThreeCards,
        GameIds.KenoProMax,
        GameIds.FishPrawnCrab,
        GameIds.SeDie,
        GameIds.VipSeDie,
        GameIds.MiniSeDie,
    ],
    [Categories.card]: [GameIds.Baccarat, GameIds.VipBaccarat, GameIds.DragonTiger, GameIds.ThreeCards],
    [Categories.dice]: [GameIds.FishPrawnCrab, GameIds.SeDie, GameIds.VipSeDie, GameIds.MiniSeDie],
    [Categories.kenolottery]: [GameIds.KenoProMax],
    [Categories.favorite]: [],
};

export const GetGameCategoryConfig = (currencyGroupName: string) => {
    if (isMegaKenoLobby()) {
        return KenoCategoryConfig;
    }
    const groups = ["Cash_INH", "GrUSD"];
    if (groups.includes(currencyGroupName)) {
        return GrUSDCategoryConfig;
    }
    return OtherCurrencyGroupCategoryConfig;
};

export const favoriteGameIdIgnore = [GameIds.KenoPower1, GameIds.KenoPower2, GameIds.KenoSoccer, GameIds.KenoSoccer2];
