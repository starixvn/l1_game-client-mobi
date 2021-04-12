import React from "react";
import SeDieGuideEN from "./en";
import SeDieGuideVI from "./vi";
import GameGuide from "../game-guide";

const SeDieGuide = () => {
    return <GameGuide component={[<SeDieGuideEN />, <SeDieGuideVI />]}></GameGuide>;
};
export default SeDieGuide;
