import React from "react";

import { GameState, GameHistory } from "../game-base/type";
import GameHeader from "../game-header/game-header";
import styles from "./game-container.module.scss";

type Props = {
    gameId: number;
    gameName: string;
    roundId: number;
    remainingTime: number;
    gameState: GameState;
    children: React.ReactNode;
    apiUrl: string;
};

const GameContainer: React.FC<Props> = (props) => {
    const { gameName, roundId, gameState, remainingTime, gameId, apiUrl } = props;
    return (
        <div className={styles["game-container"]}>
            <GameHeader
                gameId={gameId}
                gameName={gameName}
                roundId={roundId}
                gameState={gameState}
                remainingTime={remainingTime}
                apiUrl={apiUrl}
            />
            {props.children}
        </div>
    );
};

export default GameContainer;
