import React from "react";
import Styles from "./bet-history.module.scss";
import { GameContext, useGameContext } from "../../../../contexts/game-context/game-context";

const FishPrawnCrabBetHistory: React.FunctionComponent = () => {
    const gameContext = useGameContext();
    return <div>Ticket History BauCua</div>;
};

export default FishPrawnCrabBetHistory;
