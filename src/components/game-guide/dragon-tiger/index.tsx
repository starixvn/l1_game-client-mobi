import React from "react";
import DragonTigerGuideEN from "./en";
import DragonTigerGuideVI from "./vi";
import GameGuide from "../game-guide";
import { useGameContext } from "../../../contexts/game-context/game-context";

const DragonTigerGuide = () => {
    const { gameConfigs, userStakeLevel } = useGameContext();
    return (
        <GameGuide
            component={[
                <DragonTigerGuideEN gameConfigs={gameConfigs} userStakeLevel={userStakeLevel} />,
                <DragonTigerGuideVI gameConfigs={gameConfigs} userStakeLevel={userStakeLevel} />,
            ]}
        ></GameGuide>
    );
};
export default DragonTigerGuide;
