import React from "react";
import Styles from "./bet-history.module.scss";
import { GameContext, useGameContext } from "../../../../contexts/game-context/game-context";

const BigSmallBetHistory: React.FunctionComponent = () => {
    const gameContext = useGameContext();
    return <div>Ticket History BigSmall</div>;
};

export default BigSmallBetHistory;
