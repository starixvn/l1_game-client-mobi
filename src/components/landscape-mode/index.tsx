import { useTranslation } from "next-i18next";
import React from "react";
import Styles from "./landscape-mode.module.scss";

const LandscapeMode = () => {
    const { t } = useTranslation("common");

    return (
        <div className={Styles["landscape-mode"]}>
            <img src="/static/images/landscape-icon.svg" />
            <p className={Styles["info"]}>{t("common:rotateDevice")}</p>
        </div>
    );
};

export default LandscapeMode;
