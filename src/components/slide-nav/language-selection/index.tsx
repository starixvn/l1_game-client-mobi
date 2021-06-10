import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";

import { locales } from "../../../common/constants";
import Styles from "./language-selection.module.scss";

const LanguageSelection: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { locale } = useRouter();
    const { t } = useTranslation("common");
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const handleClose = () => {
        setCollapsed(true);
        setTimeout(onClose, 300);
    };
    return (
        <div className={`${Styles["navigation"]} ${collapsed ? Styles["collapsed"] : ""}`}>
            <div className={Styles["header"]}>
                <span className={`icon-back ${Styles["btn-back"]}`} onClick={handleClose}></span>
                <h1 className={Styles["title"]}>Ngôn ngữ</h1>
            </div>
            <div className={Styles["setting-container"]}>
                <Link href="/" locale="vi">
                    <div className={Styles["setting-item"]}>
                        <label>{t("vietnamese")}</label>
                        {locale === locales.vi && <span className={`icon-success ${Styles["icon-check"]}`}></span>}
                    </div>
                </Link>
                <Link href="/" locale="en">
                    <div className={Styles["setting-item"]}>
                        <label>{t("english")}</label>
                        {locale === locales.en && <span className={`icon-success ${Styles["icon-check"]}`}></span>}
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default LanguageSelection;
