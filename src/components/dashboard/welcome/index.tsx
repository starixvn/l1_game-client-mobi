import { Trans, useTranslation } from "next-i18next";
import { useTheme } from "next-themes";
import React, { useEffect } from "react";
import { User } from "sc-user-service-client/dist/auth";

import { sabaClubName, sabaMobileName, Themes } from "../../../common/constants";
import ProfilePicture from "../../profile-picture";
import FirstLoginContainer from "../container";
import TextBlock from "../text-block";
import Styles from "./welcome.module.scss";

type Props = {
    userInfo: User;
    handleFirstLoginSM: (theme: string) => void;
};

export default function Welcome({ userInfo, handleFirstLoginSM }: Props) {
    const { t } = useTranslation(["common", "register"]);
    const { theme, setTheme } = useTheme();

    const handleSubmit = () => {
        handleFirstLoginSM(theme);
    };

    useEffect(() => {
        setTheme(Themes.light);
    }, []);

    return (
        <FirstLoginContainer>
            <TextBlock>
                <Trans t={t}>{t("common:welcomeMsg", { userName: userInfo?.name, sabaMobileName: sabaMobileName })}</Trans>
            </TextBlock>
            <TextBlock>
                <Trans t={t}>{t("register:registerTitle2", { sabaMobileName: sabaMobileName, sabaClubName: sabaClubName })}</Trans>
            </TextBlock>
            <TextBlock>
                <Trans t={t}>{t("register:registerTitle3", { sabaClubName: sabaClubName })}</Trans>
            </TextBlock>
            <ProfilePicture avatarId={userInfo?.avatarId} />
            
            <button className={`${Styles["btn-blue"]} ${Styles["btn-submit"]}`} onClick={handleSubmit} data-testid="btn-welcome-submit">
                {t("common:enterGameBtn")}
            </button>
        </FirstLoginContainer>
    );
}
