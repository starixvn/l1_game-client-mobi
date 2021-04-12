import React from "react";
import DragonTigerGuideEN from "./en";
import DragonTigerGuideVI from "./vi";
import GameGuide from "../game-guide";

const DragonTigerGuide = () => {
    return <GameGuide component={[<DragonTigerGuideEN />, <DragonTigerGuideVI />]}></GameGuide>;
};
export default DragonTigerGuide;
