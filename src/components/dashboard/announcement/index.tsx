import { useTranslation } from "next-i18next";
import React from "react";
import { LanguageLocaleMapper } from "../../../common/constants";
import BaseDialog from "../../shared/base-dialog";
import AnnouncementItem from "./announcement-item";
import Styles from "./history.module.scss";

export const AnnouncementModal: React.FC<{ onCloseModal: Function; promotionNotifications }> = ({
    onCloseModal,
    promotionNotifications,
}) => {
    const { t } = useTranslation();
    const closeModal = () => {
        onCloseModal();
    };
    const { i18n } = useTranslation();

    return (
        <BaseDialog onCloseModal={closeModal} enableBackdrop={true}>
            <div className={`${Styles["popup-container"]}`}>
                <div className={Styles["title"]}>{t("popupAnnouncement")}</div>
                <span className={`icon-close ${Styles["icon-close"]}`} onClick={closeModal} data-testid="icon-close"></span>
                {promotionNotifications.map((promotionNotification, index) => (
                    <div key={index} className={`${Styles["history-content"]} -${index}`}>
                        <AnnouncementItem
                            title={promotionNotification.title[LanguageLocaleMapper[i18n.language]]}
                            content={promotionNotification.messages[LanguageLocaleMapper[i18n.language]]}
                            isActive={promotionNotification.isActive}
                        ></AnnouncementItem>
                    </div>
                ))}
            </div>
        </BaseDialog>
    );
};
