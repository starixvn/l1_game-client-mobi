import React from "react"

import { GameState } from "../game-base/type"
import GameHeader from "../game-header/game-header"
import styles from "./game-container.module.scss"

type Props = {
    gameId: number
    gameName: string
    roundId: number
    remainingTime: number
    gameState: GameState
    children: React.ReactNode
}

const GameContainer: React.FC<Props> = (props) => {
    const { gameName, roundId, gameState, remainingTime, gameId } = props
    return (
        <div className={styles["game-container"]}>
            <GameHeader
                gameId={gameId}
                gameName={gameName}
                roundId={roundId}
                gameState={gameState}
                remainingTime={remainingTime}
            />
            {props.children}
        </div>
    )
}

export default GameContainer
