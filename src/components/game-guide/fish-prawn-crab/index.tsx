import React from "react";
import FishPrawnCrabGuideEN from "./en";
import FishPrawnCrabGuideVI from "./vi";
import GameGuide from "../game-guide";
import { useGameContext } from "../../../contexts/game-context/game-context";

const FishPrawnCrab = () => {
    const { gameConfigs, userStakeLevel } = useGameContext();
    return (
        <GameGuide
            component={[
                <FishPrawnCrabGuideEN gameConfigs={gameConfigs} userStakeLevel={userStakeLevel} />,
                <FishPrawnCrabGuideVI gameConfigs={gameConfigs} userStakeLevel={userStakeLevel} />,
            ]}
        ></GameGuide>
    );
};
export default FishPrawnCrab;
