import React from "react";
import { useTranslation } from "react-i18next";
import appSettings from "../../common/app-settings";
import { GameResourceKeys } from "../../common/resources";
import Styles from "./favorite-guide.module.scss";

const favoriteGames = [22, 1];
const unfavoriteGames = [2, 3, 4];
const favoriteBtnClass = "favorite-btn";
const favoriteIconClass = "icon-favorite";

export const FavoriteGuide: React.FC = () => {
    const { t } = useTranslation();
    const { gameSettings } = appSettings;

    return (
        <div className={Styles["container"]}>
            <p>{t("favorite-setting-guideline")}</p>
            <div className={Styles["favorite-setting"]}>
                <p className={Styles["favorite-setting-btn-hint"]}>{t("favorite-setting-btn-hint")}</p>
                <ul className={Styles["favorite-games"]}>
                    {favoriteGames.map((gameId, index) => (
                        <li className={`${Styles["game"]}`} key={index}>
                            <div className={Styles[favoriteBtnClass]}>
                                <span className={`icon-favorite ${Styles[favoriteIconClass]}`}></span>
                            </div>
                            <span className={Styles["game-name"]}>
                                {t(`${gameSettings[gameId].gameName.toLocaleLowerCase()}:${GameResourceKeys.GAME_NAME}`)}
                            </span>
                            <div className={Styles["group-btn-move"]}>
                                <button className={Styles["btn-move"]} disabled={index === 0}>
                                    <span className={Styles["icon-move-up"]}></span>
                                </button>
                                <button className={Styles["btn-move"]}>
                                    <span className={Styles["icon-move-down"]}></span>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
                <ul className={Styles["unfavorite-games"]}>
                    {unfavoriteGames.map((gameId, index) => (
                        <li className={`${Styles["game"]} ${Styles["un-favorite"]}`} key={index}>
                            <div className={Styles[favoriteBtnClass]}>
                                <span className={`icon-favorite-normal ${Styles[favoriteIconClass]}`}></span>
                            </div>
                            <span className={Styles["game-name"]}>
                                {t(`${gameSettings[gameId].gameName.toLocaleLowerCase()}:${GameResourceKeys.GAME_NAME}`)}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                {t("favorite-btn-guideline").split("{icon}")[0]}
                <span className={`icon-favorite-normal ${Styles[favoriteIconClass]}`}></span>
                {t("favorite-btn-guideline").split("{icon}")[1]}
            </div>
            <div className={Styles["header"]}>
                <p className={Styles["header-favorite-btn-hint"]}>{t("header-favorite-btn-hint")}</p>
                <div className={Styles["header-left"]}>
                    <div className={Styles["header-overlay"]}></div>
                    <div className={Styles[favoriteBtnClass]}>
                        <span className={`icon-favorite-normal ${Styles["icon-favorite-normal"]}`}></span>
                    </div>
                    <div className={Styles["title-roundID"]}>
                        <div className={Styles.title}>
                            {t(`${gameSettings[2].gameName.toLocaleLowerCase()}:${GameResourceKeys.GAME_NAME}`)}
                        </div>
                        <div className={Styles.round}>#6868</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
