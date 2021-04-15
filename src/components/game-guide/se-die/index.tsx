import React from "react";
import SeDieGuideEN from "./en";
import SeDieGuideVI from "./vi";
import { useGameContext } from "../../../contexts/game-context/game-context";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

const SeDieGuide = () => {
    const { gameConfigs, userStakeLevel, gameSetting } = useGameContext();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());
    const router = useRouter();
    const components = {
        en: <SeDieGuideEN gameConfigs={gameConfigs} userStakeLevel={userStakeLevel} gameName={t("game_name")} />,
        vi: <SeDieGuideVI gameConfigs={gameConfigs} userStakeLevel={userStakeLevel} gameName={t("game_name")} />,
    };
    const { locale } = router;
    return components[locale];
};
export default SeDieGuide;
