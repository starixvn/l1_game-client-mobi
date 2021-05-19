import { useTranslation } from "next-i18next";
import React from "react";
import Styles from "./welcome.module.scss";
import HeaderStyles from "../header/header.module.scss";
import { useTheme } from "next-themes";
import { Themes } from "../../common/constants";
import { User } from "sc-user-service-client/dist/auth";

type Props = {
    userInfo: User;
    handleFirstLoginSM: (theme: string) => void;
};

export default function Welcome(props: Props) {
    const { t } = useTranslation(["common"]);
    const { theme, setTheme } = useTheme();

    const getPathAvatar = (imageId: number) => {
        return `/static/images/avatar/${imageId}.png`;
    };

    return (
        <div className={Styles["welcome-bg"]}>
            <div className={HeaderStyles["header"]}>
                <div className="game-container">
                    <div className={Styles["logo"]}>
                        <img src={`/static/images/logo-custom-saba.svg`} className="img-fluid" alt="logo" />
                    </div>
                </div>
            </div>
            <div className={`game-container ${Styles["bg"]}`}>
                <div className={Styles["curve"]}>
                    <div className={Styles["welcome-container"]}>
                        <h1 className={Styles["wellcome"]}>{t("welcomeMsg").replace("{0}", props.userInfo?.name)}</h1>
                        <div> {t("register:registerTitle2")}</div>
                    </div>
                </div>
                <div className={Styles["welcome-container"]}>
                    <div className={Styles["profile-picture"]}>
                        <img src={getPathAvatar(props.userInfo?.avatarId)} className={Styles["avartar"]} alt="Avatar" />
                    </div>

                    <div className={Styles["theme-container"]}>
                        <div className={Styles["theme-select-title"]}>{t("selectTheme")}</div>
                        <div className={Styles["theme-light"]}>
                            <div className={Styles["theme-light-icon"]}></div>
                            <label htmlFor="theme-light">{t("common:light")}</label>
                            <input
                                id="theme-light"
                                type="radio"
                                name="theme"
                                checked={theme === Themes.light}
                                onClick={() => setTheme(Themes.light)}
                            ></input>
                        </div>
                        <div className={Styles["theme-dark"]}>
                            <div className={Styles["theme-dark-icon"]}></div>
                            <label htmlFor="theme-dark">{t("common:dark")}</label>
                            <input
                                id="theme-dark"
                                type="radio"
                                name="theme"
                                checked={theme === Themes.dark}
                                onClick={() => setTheme(Themes.dark)}
                            ></input>
                        </div>

                        <button
                            className={`${Styles["btn-orange"]} ${Styles["btn-submit"]}`}
                            onClick={() => props.handleFirstLoginSM(theme)}
                        >
                            {t("enterGameBtn")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
