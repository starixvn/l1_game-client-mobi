import React, { useState } from "react";
import { useTranslation } from "next-i18next";

import appSettings from "../../common/app-settings";
import { CommonResourceKeys, GameResourceKeys } from "../../common/resources";
import BaseDialog from "../shared/base-dialog";
import { ModalType } from "../shared/base-dialog/type";
import Styles from "./favorite-setting.module.scss";

export const FavoriteSetting: React.FC<{ currentFavoriteGames: number[]; updateFavorite: Function; onCloseModal: Function }> = ({
    currentFavoriteGames,
    onCloseModal,
    updateFavorite,
}) => {
    const [favoriteGames, setFavoriteGames] = useState(currentFavoriteGames);
    const unfavoriteGames = appSettings.offeredGames.filter((game) => !favoriteGames.includes(game));
    const { t } = useTranslation();
    const { gameSettings } = appSettings;

    const addFavoriteGames = (gameId: number) => {
        favoriteGames.push(gameId);
        setFavoriteGames([...favoriteGames]);
    };

    const removeFavoriteGame = (gameId: number) => {
        const newFavoriteGames = favoriteGames.filter((id) => id !== gameId);
        setFavoriteGames(newFavoriteGames);
    };

    const onClickMove = (gameIndex: number, isMoveUp: boolean) => {
        const switchIndex = isMoveUp ? gameIndex - 1 : gameIndex + 1;
        const term = favoriteGames[gameIndex];

        favoriteGames[gameIndex] = favoriteGames[switchIndex];
        favoriteGames[switchIndex] = term;

        setFavoriteGames([...favoriteGames]);
    };

    const onClickReset = () => {
        updateFavorite([]);
        onCloseModal();
    };

    const onSubmit = () => {
        updateFavorite([...favoriteGames]);
        onCloseModal();
    };

    return (
        <BaseDialog onCloseModal={onCloseModal} type={ModalType.Center}>
            <div className={`modal-center ${Styles["favorite-setting-container"]}`}>
                <span className={Styles["close-btn"]} onClick={() => onCloseModal()}></span>
                <div className={Styles["title"]}>{t(CommonResourceKeys.FAVORITE_SETTING)}</div>
                <ul className={Styles["favorite-games"]}>
                    {favoriteGames.map((gameId, index) => (
                        <li className={Styles["game"]} key={index}>
                            <div className={Styles["favorite-btn"]} onClick={() => removeFavoriteGame(gameId)}>
                                <span className={`icon-favorite ${Styles["icon-favorite"]}`}></span>
                            </div>
                            <span>{t(`${gameSettings[gameId].gameName.toLocaleLowerCase()}:${GameResourceKeys.GAME_NAME}`)}</span>
                            <button className={Styles["btn-move-up"]} disabled={index === 0} onClick={() => onClickMove(index, true)}>
                                Up
                            </button>
                            <button
                                className={Styles["btn-move-down"]}
                                disabled={index === favoriteGames.length - 1}
                                onClick={() => onClickMove(index, false)}
                            >
                                Down
                            </button>
                        </li>
                    ))}
                </ul>
                <ul className={Styles["unfavorite-games"]}>
                    {unfavoriteGames.map((gameId, index) => (
                        <li className={Styles["game"]} key={index}>
                            <div className={Styles["favorite-btn"]} onClick={() => addFavoriteGames(gameId)}>
                                <span className={`icon-favorite-normal ${Styles["icon-favorite-normal"]}`}></span>
                            </div>
                            <span>{t(`${gameSettings[gameId].gameName.toLocaleLowerCase()}:${GameResourceKeys.GAME_NAME}`)}</span>
                        </li>
                    ))}
                </ul>
                <div className={Styles["action"]}>
                    <button className={`btn-grey ${Styles["custom-button"]}`} onClick={onClickReset}>
                        {t("reset")}
                    </button>
                    <button className={`btn-orange ${Styles["custom-button"]}`} onClick={onSubmit}>
                        {t("save")}
                    </button>
                </div>
            </div>
        </BaseDialog>
    );
};
