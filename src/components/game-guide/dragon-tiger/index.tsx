import React from "react";
import DragonTigerGuideEN from "./en";
import DragonTigerGuideVI from "./vi";
import { useGameContext } from "../../../contexts/game-context/game-context";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

const DragonTigerGuide = () => {
    const { gameConfigs, userStakeLevel, gameSetting } = useGameContext();
    const { t } = useTranslation([gameSetting.gameName.toLowerCase()]);
    const router = useRouter();
    const components = {
        en: <DragonTigerGuideEN gameConfigs={gameConfigs} userStakeLevel={userStakeLevel} gameName={t("game_name")}/>,
        vi: <DragonTigerGuideVI gameConfigs={gameConfigs} userStakeLevel={userStakeLevel} gameName={t("game_name")}/>,
    };
    const { locale } = router;
    return components[locale];
};
export default DragonTigerGuide;
