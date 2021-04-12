import React from "react";
import BigSmallGuideEN from "./en";
import BigSmallGuideVI from "./vi";
import GameGuide from "../game-guide";

const BigSmallGuide = () => {
    return <GameGuide component={[<BigSmallGuideEN />, <BigSmallGuideVI />]}></GameGuide>;
};
export default BigSmallGuide;
