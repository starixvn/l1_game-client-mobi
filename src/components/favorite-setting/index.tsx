import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";

import appSettings from "../../common/app-settings";
import { CommonResourceKeys, GameResourceKeys } from "../../common/resources";
import BaseDialog from "../shared/base-dialog";
import { ModalType } from "../shared/base-dialog/type";
import Styles from "./favorite-setting.module.scss";
import { isMobileOnly } from "react-device-detect";

export const FavoriteSetting: React.FC<{
    currentFavoriteGames: number[];
    updateFavorite: Function;
    onCloseModal: Function;
    toggleBtnRef: React.MutableRefObject<HTMLElement>;
}> = ({ currentFavoriteGames, onCloseModal, updateFavorite, toggleBtnRef }) => {
    const [favoriteGames, setFavoriteGames] = useState(currentFavoriteGames);
    const unfavoriteGames = appSettings.offeredGames.filter((game) => !favoriteGames.includes(game));
    const [isOpenModalAnimation, setIsOpenModalAnimation] = useState(true);
    const { t } = useTranslation();
    const { gameSettings } = appSettings;
    let closeModalTimeOut: NodeJS.Timeout;

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
        handleCloseModal();
    };

    const onSubmit = () => {
        updateFavorite([...favoriteGames]);
        handleCloseModal();
    };

    const handleCloseModal = () => {
        setIsOpenModalAnimation(false);

        if (isMobileOnly) {
            closeModalTimeOut = setTimeout(() => onCloseModal(), 300);
        } else {
            onCloseModal();
        }
    };

    useEffect(() => clearTimeout(closeModalTimeOut), []);

    return (
        <BaseDialog onCloseModal={onCloseModal} type={ModalType.FavoriteSetting} toggleBtnRef={toggleBtnRef}>
            <div
                className={`${Styles["favorite-setting"]} ${
                    isMobileOnly && isOpenModalAnimation ? Styles["open-animation"] : Styles["close-animation"]
                }`}
            >
                <span className={Styles["close-btn"]} onClick={handleCloseModal}></span>
                <div className={Styles["title"]}>{t(CommonResourceKeys.FAVORITE_SETTING)}</div>
                <ul className={Styles["favorite-games"]}>
                    {favoriteGames.map((gameId, index) => (
                        <li className={`${Styles["game"]}`} key={index}>
                            <div className={Styles["favorite-btn"]} onClick={() => removeFavoriteGame(gameId)}>
                                <span className={`icon-favorite ${Styles["icon-favorite"]}`}></span>
                            </div>
                            <span className={Styles["game-name"]}>
                                {t(`${gameSettings[gameId].gameName.toLocaleLowerCase()}:${GameResourceKeys.GAME_NAME}`)}
                            </span>
                            <div className={Styles["group-btn-move"]}>
                                <button className={Styles["btn-move"]} disabled={index === 0} onClick={() => onClickMove(index, true)}>
                                    <span className={Styles["icon-move-up"]}></span>
                                </button>
                                <button
                                    className={Styles["btn-move"]}
                                    disabled={index === favoriteGames.length - 1}
                                    onClick={() => onClickMove(index, false)}
                                >
                                    <span className={Styles["icon-move-down"]}></span>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
                <ul className={Styles["unfavorite-games"]}>
                    {unfavoriteGames.map((gameId, index) => (
                        <li className={`${Styles["game"]} ${Styles["un-favorite"]}`} key={index}>
                            <div className={Styles["favorite-btn"]} onClick={() => addFavoriteGames(gameId)}>
                                <span className={`icon-favorite-normal ${Styles["icon-favorite"]}`}></span>
                            </div>
                            <span className={Styles["game-name"]}>
                                {t(`${gameSettings[gameId].gameName.toLocaleLowerCase()}:${GameResourceKeys.GAME_NAME}`)}
                            </span>
                        </li>
                    ))}
                </ul>
                <div className={Styles["actions"]}>
                    <button className={`btn-grey`} onClick={onClickReset}>
                        {t("reset")}
                    </button>
                    <button className={`btn-orange`} onClick={onSubmit}>
                        {t("save")}
                    </button>
                </div>
            </div>
        </BaseDialog>
    );
};
