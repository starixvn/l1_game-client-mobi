import { useTranslation } from 'next-i18next';
import React, { useState } from 'react';

import { GameResourceKeys } from '../../../common/resources/game-resource-keys';
import { useFavoriteGameContext } from '../../../contexts/favorite-games/favorite-games-context';
import CountdownTimer from '../countdown-timer/countdown-timer';
import Styles from './game-header.module.scss';

type Props = {
    gameId: number;
    gameName: string;
    roundId: number;
    gameState: number;
    remainingTime: number;
};

export default function GameHeader(props: Props) {
    const favoriteContext = useFavoriteGameContext();
    const { gameName, roundId, gameState, remainingTime, gameId } = props;
    const [isFavorite, updateFavorite] = useState<boolean>(favoriteContext.isFavorite(gameId));

    const { t } = useTranslation(gameName.toLowerCase());

    const favoriteClickHandle = () => {
        favoriteContext.setFavorite(gameId, !isFavorite);
        updateFavorite(!isFavorite);
    };

    return (
        <div className={Styles.header}>
            <div className={Styles["header-left"]}>
                <div className={`${Styles["favorite-btn"]} ${isFavorite ? Styles.isFavorite : ""}`} onClick={() => favoriteClickHandle()}>
                    <span className="icon-favorite"></span>
                </div>
                <div className={Styles["title-roundID"]}>
                    <div className={Styles.title}>{t(GameResourceKeys.GAME_NAME)}</div>
                    <div className={Styles.round}>#{roundId}</div>
                </div>
            </div>
            <div className={Styles["header-right"]}>
                <div className={Styles.rebet}>
                    <img alt="rebet" src="/static/images/icon-rebet.svg" />
                    <label>Rebet</label>
                </div>
                <div className={Styles["count-down"]}>
                    <CountdownTimer remainingTime={remainingTime} key={gameState}></CountdownTimer>
                </div>
            </div>
        </div>
    );
}
