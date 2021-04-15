import React from "react";
import FishPrawnCrabGuideEN from "./en";
import FishPrawnCrabGuideVI from "./vi";
import { useGameContext } from "../../../contexts/game-context/game-context";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

const FishPrawnCrab = () => {
    const { gameConfigs, userStakeLevel, gameSetting } = useGameContext();
    const { t } = useTranslation([gameSetting.gameName.toLowerCase()]);
    const router = useRouter();
    const components = {
        en: <FishPrawnCrabGuideEN gameConfigs={gameConfigs} userStakeLevel={userStakeLevel} gameName={t("game_name")} />,
        vi: <FishPrawnCrabGuideVI gameConfigs={gameConfigs} userStakeLevel={userStakeLevel} gameName={t("game_name")} />,
    };
    const { locale } = router;
    return components[locale];
};
export default FishPrawnCrab;
