import React from "react";
import SeDieGuideEN from "./en";
import SeDieGuideVI from "./vi";
import { useGameContext } from "../../../contexts/game-context/game-context";
import { useRouter } from "next/router";

const SeDieGuide = () => {
    const { gameConfigs, userStakeLevel } = useGameContext();
    const router = useRouter();
    const components = {
        en: <SeDieGuideEN gameConfigs={gameConfigs} userStakeLevel={userStakeLevel} />,
        vi: <SeDieGuideVI gameConfigs={gameConfigs} userStakeLevel={userStakeLevel} />,
    };
    const { locale } = router;
    return components[locale];
};
export default SeDieGuide;
