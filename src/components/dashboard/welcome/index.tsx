import { Trans, useTranslation } from "next-i18next";
import { useTheme } from "next-themes";
import React, { useEffect } from "react";
import { User } from "sc-user-service-client/dist/auth";

import { sabaClubName, sabaMobileName, Themes } from "../../../common/constants";
import FirstLoginContainer from "../container";
import TextBlock from "../text-block";
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
            <TextBlock>
                <Trans t={t}>{t("common:welcomeMsg", { userName: props.userInfo?.name, sabaMobileName: sabaMobileName })}</Trans>
            </TextBlock>
            <TextBlock>
                <Trans t={t}>{t("register:registerTitle2", { sabaMobileName: sabaMobileName, sabaClubName: sabaClubName })}</Trans>
            </TextBlock>
            <TextBlock>
                <Trans t={t}>{t("register:registerTitle3", { sabaClubName: sabaClubName })}</Trans>
            </TextBlock>
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
