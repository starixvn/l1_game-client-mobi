import React from "react";
import Styles from "./ticket-history.module.scss";
import { GameContext, useGameContext } from "../../../../contexts/game-context/game-context";

type Props = {
    gameContext?: any;
};

const SeDieTicketHistory: React.FunctionComponent<Props> = () => {
    const gameContext = useGameContext();
    return <div>Ticket History</div>;
};

export default SeDieTicketHistory;
