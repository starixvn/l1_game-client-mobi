import React, { useEffect, useState } from "react";

import appSettings from "../../../common/app-settings";
import GameContainer from "../../shared/game-container";

const SeDie = () => {
    return <GameContainer {...appSettings.seDie}></GameContainer>;
};

export default SeDie;
