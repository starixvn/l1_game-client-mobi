import { Trans, useTranslation } from "next-i18next";
import React, { useMemo } from "react";
import { LanguageLocaleMapper } from "../../../common/constants";
import BaseDialog from "../../shared/base-dialog";
import AnnouncementItem from "./announcement-item";
import Styles from "./announcement.module.scss";

export const AnnouncementModal: React.FC<{
    onCloseModal: Function;
    promotionNotifications;
    openGame: (gameId: number) => void;
}> = ({ onCloseModal, promotionNotifications, openGame }) => {
    const { t } = useTranslation();
    const closeModal = () => {
        onCloseModal();
    };
    const { i18n } = useTranslation();

    return useMemo(() => {
        return (
            <BaseDialog onCloseModal={closeModal} enableBackdrop={true}>
                <div className={`${Styles["popup-container"]}`}>
                    <div className={Styles["title"]}>{t("popupAnnouncement")}</div>
                    <span className={`icon-close ${Styles["icon-close"]}`} onClick={closeModal} data-testid="icon-close"></span>
                    <div className={Styles["wrapper"]}>
                        <div className={Styles["tabs"]}>
                            <div className={Styles["tab"]}>
                                <input type="radio" name="css-tabs" id="promotion" defaultChecked className={Styles["tab-switch"]} />
                                <label htmlFor="promotion" className={Styles["tab-label"]}>
                                    {t("promotion")}
                                    {promotionNotifications.length > 0 ? (
                                        <span className={Styles["count"]}>{promotionNotifications?.length}</span>
                                    ) : (
                                        ""
                                    )}
                                </label>
                                <div className={Styles["tab-content"]}>
                                    {promotionNotifications.length > 0 && (
                                        <ul className={Styles["list-item"]}>
                                            {promotionNotifications.map((promotionNotification, index) => (
                                                <li key={index} className={`${Styles["item-content"]} -${index}`}>
                                                    <AnnouncementItem
                                                        title={promotionNotification.title[LanguageLocaleMapper[i18n.language]]}
                                                        content={promotionNotification.messages[LanguageLocaleMapper[i18n.language]]}
                                                        isActive={promotionNotification.isActive}
                                                        gameId={promotionNotification.gameId}
                                                        openGame={openGame}
                                                        onCloseAnnouncement={closeModal}
                                                    ></AnnouncementItem>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                            <div className={Styles["tab"]}>
                                <input type="radio" name="css-tabs" id="terms" className={Styles["tab-switch"]} />
                                <label htmlFor="terms" className={Styles["tab-label"]}>
                                    {t("terms")}
                                </label>
                                <div className={Styles["tab-content"]}>
                                    <ul className={Styles["list-terms"]}>
                                        <li>
                                            <Trans t={t}>{t("common:termsPromotion-1")}</Trans>
                                        </li>
                                        <li>
                                            <Trans t={t}>{t("common:termsPromotion-2")}</Trans>
                                        </li>
                                        <li>
                                            <Trans t={t}>{t("common:termsPromotion-3")}</Trans>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </BaseDialog>
        );
    }, [promotionNotifications]);
};
