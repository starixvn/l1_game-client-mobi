import { useTranslation } from "next-i18next";
import React, { useEffect } from "react";
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

    useEffect(() => {
        setTheme(Themes.light);
    }, []);

    const getPathAvatar = (imageId: number) => {
        return `/static/images/avatar/${imageId}.png`;
    };

    return (
        <div className={Styles["page-bg"]}>
            <div className={HeaderStyles["header"]}>
                <div className="game-container">
                    <div className={Styles["logo"]}>
                        <img src={`/static/images/logo-custom-saba.svg`} className="img-fluid" alt="logo" />
                    </div>
                </div>
            </div>
            <div className={`game-container ${Styles["bg"]}`}>
                <div className={Styles["curve"]}>
                    <div className={Styles["page-container"]}>
                        <div
                            className={Styles["wellcome"]}
                            dangerouslySetInnerHTML={{ __html: t("welcomeMsg").replace("{0}", `<b>${props.userInfo?.name}</b>`) }}
                        ></div>
                    </div>
                </div>
                <div className={Styles["page-container"]}>
                    <div className={Styles["profile-picture"]}>
                        <img src={getPathAvatar(props.userInfo?.avatarId)} className={Styles["avartar"]} alt="Avatar" />
                    </div>

                    <div className={Styles["theme-container"]}>
                        <div className={Styles["theme-select-title"]}>{t("selectTheme")}</div>
                        <div className={Styles["theme-list"]}>
                            <div className={Styles["theme"]}>
                                <div className={`${Styles["theme-light-icon"]}`} onClick={() => setTheme(Themes.light)}>
                                    <span className={Styles["line1"]}></span>
                                    <span className={Styles["line2"]}></span>
                                </div>
                                <div>
                                    <input
                                        id="theme-light"
                                        type="radio"
                                        name="theme"
                                        checked={theme === Themes.light}
                                        onChange={() => setTheme(Themes.light)}
                                        className={Styles["radio-button"]}
                                    />
                                    <label className={Styles["radio-label"]} htmlFor="theme-light">
                                        {t("common:light")}
                                    </label>
                                </div>
                            </div>
                            <div className={Styles["theme"]}>
                                <div className={Styles["theme-dark-icon"]} onClick={() => setTheme(Themes.dark)}>
                                    <span className={Styles["line1"]}></span>
                                    <span className={Styles["line2"]}></span>
                                </div>
                                <div>
                                    <input
                                        id="theme-dark"
                                        type="radio"
                                        name="theme"
                                        checked={theme === Themes.dark}
                                        onChange={() => setTheme(Themes.dark)}
                                        className={Styles["radio-button"]}
                                    />
                                    <label className={Styles["radio-label"]} htmlFor="theme-dark">
                                        {t("common:dark")}
                                    </label>
                                </div>
                            </div>
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
