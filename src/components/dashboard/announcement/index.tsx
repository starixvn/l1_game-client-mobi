import { useTranslation } from "next-i18next";
import React from "react";
import BaseDialog from "../../shared/base-dialog";
import Styles from "./history.module.scss";

export const AnnouncementModal: React.FC<{ onCloseModal: Function; promotionNotifications }> = ({
    onCloseModal,
    promotionNotifications,
}) => {
    const { t } = useTranslation();
    const closeModal = () => {
        onCloseModal();
    };

    return (
        <BaseDialog onCloseModal={closeModal} enableBackdrop={true}>
            <div className={`w-100 ${Styles["popup-container"]}`}>
                <div className={Styles["title"]}>{t("popupAnnouncement")}</div>
                <span className={`icon-close ${Styles["icon-close"]}`} onClick={closeModal} data-testid="icon-close"></span>
                <div className={`w-100 ${Styles["history-content"]}`}>
                    <ul>
                        <li>Promotion</li>

                        <li>Promotion</li>
                    </ul>
                </div>
            </div>
        </BaseDialog>
    );
};
