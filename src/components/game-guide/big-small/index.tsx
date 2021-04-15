import React from "react";
import BigSmallGuideEN from "./en";
import BigSmallGuideVI from "./vi";
import { useGameContext } from "../../../contexts/game-context/game-context";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

const BigSmallGuide = () => {
    const { gameConfigs, userStakeLevel, gameSetting } = useGameContext();
    const { t } = useTranslation([gameSetting.gameName.toLowerCase()]);
    const router = useRouter();
    const components = {
        en: <BigSmallGuideEN gameConfigs={gameConfigs} userStakeLevel={userStakeLevel} gameName={t("game_name")} />,
        vi: <BigSmallGuideVI gameConfigs={gameConfigs} userStakeLevel={userStakeLevel} gameName={t("game_name")} />,
    };
    const { locale } = router;
    return components[locale];
};
export default BigSmallGuide;
