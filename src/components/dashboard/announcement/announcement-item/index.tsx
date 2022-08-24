import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import { Props } from "./types";
import Styles from "../announcement.module.scss";

const AnnouncementItem: React.FunctionComponent<Props> = ({ title, content, isActive }) => {
    console.log(title, content, isActive);
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    return (
        <>
            <img src={`/static/images/icon-badge.svg`} className={Styles[`img-fluid`]} height="46" width="36" alt="Promotion" />
            <div className={Styles["content"]}>
                <span className={Styles["title"]}>{title}</span>
                <p className={Styles["text"]}>{content}</p>
                <div className={Styles["bottom"]}>
                    <button className={`btn-red ${Styles["btn"]}`} disabled={isActive}>
                        {t("joinGame")}
                    </button>
                </div>
            </div>
        </>
    );
};

export default AnnouncementItem;
