import { useTranslation } from "next-i18next";
import { useTheme } from "next-themes";
import React, { useEffect } from "react";
import { User } from "sc-user-service-client/dist/auth";

import { sabaClubName, sabaMobileName, Themes } from "../../../../common/constants";
import FirstLoginContainer from "../container";
import ThemeSelection from "../theme-selection";
import Styles from "./welcome.module.scss";

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
        <FirstLoginContainer>
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

            <ThemeSelection />
            <button className={`${Styles["btn-orange"]} ${Styles["btn-submit"]}`} onClick={() => props.handleFirstLoginSM(theme)}>
                {t("common:enterGameBtn")}
            </button>
        </FirstLoginContainer>
    );
}
