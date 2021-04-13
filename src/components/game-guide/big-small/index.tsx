import React from "react";
import BigSmallGuideEN from "./en";
import BigSmallGuideVI from "./vi";
import GameGuide from "../game-guide";
import { useGameContext } from "../../../contexts/game-context/game-context";

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
