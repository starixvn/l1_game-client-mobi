import { useTranslation } from "next-i18next";
import React, { useEffect, useRef, useState } from "react";
import { isMobileOnly } from "react-device-detect";

import appSettings from "../../common/app-settings";
import { CommonResourceKeys, GameResourceKeys } from "../../common/resources";
import {favoriteGameIdIgnore} from "../game-category/constants"
import Styles from "./favorite-setting.module.scss";

export const FavoriteSetting: React.FC<{
    currentFavoriteGames: number[];
    offerGames: number[];
    updateFavorite: Function;
    onCloseModal: Function;
    toggleBtnRef: React.MutableRefObject<HTMLElement>;
}> = ({ currentFavoriteGames, offerGames, onCloseModal, updateFavorite, toggleBtnRef }) => {
    const [favoriteGames, setFavoriteGames] = useState(currentFavoriteGames.filter(game => !favoriteGameIdIgnore.includes(game)));
    const unfavoriteGames = appSettings.offeredGames.filter((game) => !favoriteGames.includes(game) && !favoriteGameIdIgnore.includes(game));
    const [isOpenModalAnimation, setIsOpenModalAnimation] = useState(true);
    const { t } = useTranslation();
    const { gameSettings } = appSettings;
    const wrapperRef = useRef<HTMLDivElement>(null);
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
        setIsOpenModalAnimation(false);

        if (isMobileOnly) {
            closeModalTimeOut = setTimeout(() => onCloseModal(), 300);
        } else {
            onCloseModal();
        }
    };

    const handleCloseModal = () => {
        setFavoriteGames([...currentFavoriteGames]);
        setIsOpenModalAnimation(false);

        if (isMobileOnly) {
            closeModalTimeOut = setTimeout(() => onCloseModal(), 300);
        } else {
            onCloseModal();
        }
    };

    useEffect(() => {
        clearTimeout(closeModalTimeOut);
        isMobileOnly && document.body.classList.add("no-scroll");
        isMobileOnly && document.documentElement.classList.add("no-scroll-html");

        return () => {
            isMobileOnly && document.body.classList.remove("no-scroll");
            isMobileOnly && document.documentElement.classList.remove("no-scroll-html");
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef?.current && !wrapperRef.current.contains(event.target) && !toggleBtnRef.current.contains(event.target)) {
                handleCloseModal();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    return (
        <div
            ref={wrapperRef}
            className={`${Styles["favorite-setting"]} ${
                isMobileOnly && (isOpenModalAnimation ? Styles["open-animation"] : Styles["close-animation"])
            } ${isMobileOnly ? Styles["mobile"] : ""}`}
        >
            <span className={Styles["close-btn"]} onClick={handleCloseModal}></span>
            <div className={Styles["title"]}>{t(CommonResourceKeys.FAVORITE_SETTING)}</div>
            <div className={Styles["main-content"]}>
                {favoriteGames.length > 0 && (
                    <ul className={Styles["favorite-games"]}>
                        {favoriteGames
                            .filter((game) => offerGames.includes(game))
                            .map((gameId, index) => (
                                <li className={`${Styles["game"]}`} key={index}>
                                    <div className={Styles["favorite-btn"]} onClick={() => removeFavoriteGame(gameId)}>
                                        <span className={`icon-favorite ${Styles["icon-favorite"]}`}></span>
                                    </div>
                                    <span className={Styles["game-name"]}>
                                        {t(`${gameSettings[gameId].gameName.toLocaleLowerCase()}:${GameResourceKeys.GAME_NAME}`)}
                                    </span>
                                    <div className={Styles["group-btn-move"]}>
                                        <button
                                            className={Styles["btn-move"]}
                                            disabled={index === 0}
                                            onClick={() => onClickMove(index, true)}
                                        >
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
                )}
                {unfavoriteGames.length > 0 && (
                    <ul className={Styles["unfavorite-games"]}>
                        {unfavoriteGames
                            .filter((game) => offerGames.includes(game))
                            .map((gameId, index) => (
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
                )}
            </div>

            <div className={Styles["actions"]}>
                <button className={`btn-grey`} onClick={onClickReset}>
                    {t("reset")}
                </button>
                <button className={`btn-orange`} onClick={onSubmit}>
                    {t("save")}
                </button>
            </div>
        </div>
    );
};
