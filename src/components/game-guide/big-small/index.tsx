import React from "react";

import { useGameContext } from "../../../contexts/game-context/game-context";
import GameGuide from "../game-guide";
import BigSmallGuideEN from "./en";
import BigSmallGuideVI from "./vi";

const BigSmallGuide = () => {
    const { gameConfigs, userStakeLevel } = useGameContext();
    return (
        <GameGuide
            component={[
                <BigSmallGuideEN gameConfigs={gameConfigs} userStakeLevel={userStakeLevel} />,
                <BigSmallGuideVI gameConfigs={gameConfigs} userStakeLevel={userStakeLevel} />,
            ]}
        ></GameGuide>
    );
};
export default BigSmallGuide;
