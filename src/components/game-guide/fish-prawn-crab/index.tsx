import React from "react";
import FishPrawnCrabGuideEN from "./en";
import FishPrawnCrabGuideVI from "./vi";
import GameGuide from "../game-guide";

const FishPrawnCrab = () => {
    return <GameGuide component={[<FishPrawnCrabGuideEN />, <FishPrawnCrabGuideVI />]}></GameGuide>;
};
export default FishPrawnCrab;
