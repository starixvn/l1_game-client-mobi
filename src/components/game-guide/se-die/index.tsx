import React from "react";
import SeDieGuideEN from "./en";
import SeDieGuideVI from "./vi";
import { useGameContext } from "../../../contexts/game-context/game-context";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

export const SedDieNameMapping = { 2: "XocXoc", 22: "VipSeDie" };
export const SedDieName = { XocXoc: "XocXoc", VipSeDie: "VipSeDie" };
const SeDieGuide = () => {
    const { gameConfigs, userStakeLevel, gameSetting } = useGameContext();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());
    const router = useRouter();
    const components = {
        en: <SeDieGuideEN gameConfigs={gameConfigs} userStakeLevel={userStakeLevel} gameName={t("game_name")} gameId={gameSetting.id} />,
        vi: <SeDieGuideVI gameConfigs={gameConfigs} userStakeLevel={userStakeLevel} gameName={t("game_name")} gameId={gameSetting.id} />,
    };
    const { locale } = router;
    return components[locale];
};
export default SeDieGuide;
