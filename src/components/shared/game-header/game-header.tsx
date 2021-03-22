import { useTranslation } from "next-i18next"
import React from "react"

import { GameResourceKeys } from "../../../common/resources/game-resource-keys"
import { useFavoriteGameContext } from "../../contexts/favorite-games/favorite-games-context"
import CountdownTimer from "../countdown-timer/countdown-timer"
import Styles from "./game-header.module.scss"

type Props = {
    gameId: number
    gameName: string
    roundId: number
    gameState: number
    remainingTime: number
}

export default function GameHeader(props: Props) {
    const { gameName, roundId, gameState, remainingTime } = props
    const { t } = useTranslation(gameName.toLowerCase())
    const favoriteContext = useFavoriteGameContext()

    return (
        <div className={Styles.header}>
            <div className={Styles.left}>
                <div className={Styles.favorite}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-star-fill"
                        viewBox="0 0 16 16"
                    >
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                    </svg>
                    <div className={Styles["edge-cut"]}></div>
                </div>
                <div className={Styles.title}>
                    {t(GameResourceKeys.GAME_NAME)}
                </div>
                <div className={Styles.round}>
                    {t(GameResourceKeys.ROUND)}: {roundId}
                </div>
            </div>
            <div className={Styles.right}>
                <CountdownTimer
                    remainingTime={remainingTime}
                    key={gameState}
                ></CountdownTimer>
    )
}
