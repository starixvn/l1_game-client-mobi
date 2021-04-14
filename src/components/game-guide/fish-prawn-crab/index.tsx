import React from "react";
import FishPrawnCrabGuideEN from "./en";
import FishPrawnCrabGuideVI from "./vi";
import { useGameContext } from "../../../contexts/game-context/game-context";
import { useRouter } from "next/router";

const FishPrawnCrab = () => {
    const { gameConfigs, userStakeLevel } = useGameContext();
    const router = useRouter();
    const components = {
        en: <FishPrawnCrabGuideEN gameConfigs={gameConfigs} userStakeLevel={userStakeLevel} />,
        vi: <FishPrawnCrabGuideVI gameConfigs={gameConfigs} userStakeLevel={userStakeLevel} />,
    };
    const { locale } = router;
    return components[locale];
};
export default FishPrawnCrab;
