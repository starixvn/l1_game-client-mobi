import React from "react";
import BigSmallGuideEN from "./en";
import BigSmallGuideVI from "./vi";
import { useGameContext } from "../../../contexts/game-context/game-context";
import { useRouter } from "next/router";

const BigSmallGuide = () => {
    const { gameConfigs, userStakeLevel } = useGameContext();
    const router = useRouter();
    const components = {
        en: <BigSmallGuideEN gameConfigs={gameConfigs} userStakeLevel={userStakeLevel} />,
        vi: <BigSmallGuideVI gameConfigs={gameConfigs} userStakeLevel={userStakeLevel} />,
    };
    const { locale } = router;
    return components[locale];
};
export default BigSmallGuide;
