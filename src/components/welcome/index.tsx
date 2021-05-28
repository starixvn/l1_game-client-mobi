import { useTranslation } from "next-i18next";
import React, { useEffect } from "react";
import Styles from "./welcome.module.scss";
import HeaderStyles from "../header/header.module.scss";
import { useTheme } from "next-themes";
import { Themes } from "../../common/constants";
import { User } from "sc-user-service-client/dist/auth";
import { sabaClubName, sabaMobileName } from "../../common/constants";

type Props = {
    userInfo: User;
    handleFirstLoginSM: (theme: string) => void;
};

export default function Welcome(props: Props) {
    const { t } = useTranslation(["common", "register"]);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setTheme(Themes.light);
    }, []);

    const getPathAvatar = (imageId: number) => {
        return `/static/images/avatar/${imageId}.png`;
    };

    return (
        <div className={Styles["wrapper"]}>
            <div className={Styles["page-bg"]}>
                <div className={Styles["page-container"]}>
                    <a className={Styles["logo"]}>
                        <img src={`/static/images/logo-custom-saba.svg`} className={Styles["img-logo"]} alt="logo" />
                    </a>
                    <div
                        className={Styles["welcome"]}
                        dangerouslySetInnerHTML={{
                            __html: t("common:welcomeMsg")
                                .replace("{0}", `<b>${props.userInfo?.name}</b>`)
                                .replace("{1}", `<b>${sabaMobileName}!</b>`),
                        }}
                    ></div>

                    <div
                        className={Styles["welcome"]}
                        dangerouslySetInnerHTML={{
                            __html: t("register:registerTitle2")
                                .replace("{0}", `<b>${sabaMobileName}</b>`)
                                .replace("{1}", `<b>${sabaClubName}</b>`),
                        }}
                    ></div>
                    <div
                        className={Styles["welcome"]}
                        dangerouslySetInnerHTML={{ __html: t("register:registerTitle3").replace("{0}", `<b>${sabaClubName}</b>`) }}
                    ></div>
                    <div className={Styles["profile-picture"]}>
                        {props.userInfo?.avatarId > 0 && props.userInfo?.avatarId < 41 ? (
                            <img src={getPathAvatar(props.userInfo?.avatarId)} className={Styles["avartar"]} alt="Avatar" />
                        ) : (
                            <span className={`icon-user ${Styles["icon-user"]}`}></span>
                        )}
                    </div>

                    <div className={Styles["theme-container"]}>
                        <div className={Styles["theme-select-title"]}>{t("common:selectTheme")}</div>
                        <div className={Styles["theme-list"]}>
                            <div className={Styles["theme"]}>
                                <div className={`${Styles["theme-light-icon"]}`} onClick={() => setTheme(Themes.light)}>
                                    <span className={Styles["line1"]}></span>
                                    <span className={Styles["line2"]}></span>
                                </div>
                                <div className={Styles["radio-group"]}>
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
                                <div className={Styles["radio-group"]}>
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
                            {t("common:enterGameBtn")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
