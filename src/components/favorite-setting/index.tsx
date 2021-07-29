import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import appSettings from "../../common/app-settings";
import { CommonResourceKeys, GameResourceKeys } from "../../common/resources";
import BaseDialog from "../shared/base-dialog";
import { ModalType } from "../shared/base-dialog/type";
import Styles from "./favorite-setting.module.scss";

let startDragGameId = -1;

export const FavoriteSetting: React.FC<{ favoriteGames: number[]; updateFavorite: Function; onCloseModal: Function }> = ({
    favoriteGames,
    onCloseModal,
    updateFavorite,
}) => {
    const [gameOrder, setGameOrder] = useState(favoriteGames);
    const { t } = useTranslation();
    const { gameSettings } = appSettings;

    const onDragStart = (event: React.DragEvent, gameId: number) => {
        event.dataTransfer.effectAllowed = "move";
        startDragGameId = gameId;
    };

    const onDragOver = (dragOverGameId: number) => {
        if (startDragGameId !== -1 && dragOverGameId !== startDragGameId) {
            const dragOverIndex = gameOrder.findIndex((id) => dragOverGameId === id);
            const dragStartIndex = gameOrder.findIndex((id) => startDragGameId === id);

            gameOrder[dragOverIndex] = startDragGameId;
            gameOrder[dragStartIndex] = dragOverGameId;

            setGameOrder([...gameOrder]);
        }
    };

    const onDragEnd = () => {
        startDragGameId = -1;
    };

    const onClickReset = () => {};

    const onSubmit = () => {
        updateFavorite([...gameOrder]);
    };

    return (
        <BaseDialog onCloseModal={onCloseModal} type={ModalType.Center}>
            <div className={`modal-center ${Styles["favorite-setting-container"]}`}>
                <span className={Styles["close-btn"]} onClick={() => onCloseModal()}></span>
                <div className={Styles["title"]}>{t(CommonResourceKeys.FAVORITE_SETTING)}</div>
                <ul className={Styles["favorite-games"]}>
                    {gameOrder.map((gameId, index) => (
                        <li
                            className={Styles["game"]}
                            draggable
                            onDragStart={(event) => onDragStart(event, gameId)}
                            onDragOver={() => onDragOver(gameId)}
                            onDragEnd={onDragEnd}
                            key={index}
                        >
                            <span>{t(`${gameSettings[gameId].gameName.toLocaleLowerCase()}:${GameResourceKeys.GAME_NAME}`)}</span>
                            <span className={Styles["hamburger"]}></span>
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
