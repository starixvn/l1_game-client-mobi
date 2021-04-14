import React from "react";
import DragonTigerGuideEN from "./en";
import DragonTigerGuideVI from "./vi";
import { useGameContext } from "../../../contexts/game-context/game-context";
import { useRouter } from "next/router";

const DragonTigerGuide = () => {
    const { gameConfigs, userStakeLevel } = useGameContext();
    const router = useRouter();
    const components = {
        en: <DragonTigerGuideEN gameConfigs={gameConfigs} userStakeLevel={userStakeLevel} />,
        vi: <DragonTigerGuideVI gameConfigs={gameConfigs} userStakeLevel={userStakeLevel} />,
    };
    const { locale } = router;
    return components[locale];
};
export default DragonTigerGuide;
