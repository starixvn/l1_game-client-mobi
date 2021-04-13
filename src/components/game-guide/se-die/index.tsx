import React from "react";
import SeDieGuideEN from "./en";
import SeDieGuideVI from "./vi";
import GameGuide from "../game-guide";
import { useGameContext } from "../../../contexts/game-context/game-context";

const SeDieGuide = () => {
    const { gameConfigs, userStakeLevel } = useGameContext();
    return <GameGuide component={[<SeDieGuideEN gameConfigs={gameConfigs} userStakeLevel={userStakeLevel} />, <SeDieGuideVI gameConfigs={gameConfigs} userStakeLevel={userStakeLevel} />]}></GameGuide>;
};
export default SeDieGuide;
