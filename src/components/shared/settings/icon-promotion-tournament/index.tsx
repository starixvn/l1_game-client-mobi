import { useTranslation } from "next-i18next";
import { useEffect, useRef, useState } from "react";
import { isMobileOnly } from "react-device-detect";
import { getLocalStorageItem, localStorageKeys, removeLocalStorageItem, storeLocalStorageItem } from "../../../../common/local-storage";
import { useAuthContext } from "../../../../contexts/auth";
import { ModalEventActionType, useModalDispatch } from "../../../../contexts/modal-context";
import { Tooltip } from "../../tooltip";
import styles from "../settings.module.scss";
import { getExistPromotionTournamentNotification, getNewOrRunningPromotionTournament } from "../../../../services/promotion-service";

const IconPromotionTournament = () => {
    const { session } = useAuthContext();
    const { t } = useTranslation();
    const dispatch = useModalDispatch();
    const [isActive, setIsActive] = useState(false);
    const togglePromotionTournamentBtnRef = useRef<HTMLDivElement>(null);
    const specialClassByDevice = !isMobileOnly ? "desktop-style" : "";

    useEffect(() => {
        let intervalPromotionTournament = null;
        const params = {
            sessionId: Buffer.from(session.ss).toString("base64"),
            username: session.username,
        };
        const isTournamentPopupAutoOpenedKey = localStorageKeys.isTournamentPopupAutoOpened;

        const checkPromotionTournament = async () => {
            const isExistPromotionTournamentNotification = await getExistPromotionTournamentNotification(params);

            if (isExistPromotionTournamentNotification) {
                setIsActive(isExistPromotionTournamentNotification);
                const isNewOrRunningPromotionTournament = await getNewOrRunningPromotionTournament(params);
                if (isNewOrRunningPromotionTournament) {
                    const isTournamentPopupAutoOpened = getLocalStorageItem<boolean>(isTournamentPopupAutoOpenedKey) ?? false;

                    !isTournamentPopupAutoOpened && dispatch({ type: ModalEventActionType.TogglePromotionTournamentModal, payload: true });
                    storeLocalStorageItem(isTournamentPopupAutoOpenedKey, true);
                }
            }
        };

        if (session?.ss) {
            checkPromotionTournament();
            intervalPromotionTournament && clearInterval(intervalPromotionTournament);
            intervalPromotionTournament = setInterval(() => {
                checkPromotionTournament();
            }, 1000 * 60 * 10);
        }

        return () => {
            removeLocalStorageItem(isTournamentPopupAutoOpenedKey);
            intervalPromotionTournament && clearInterval(intervalPromotionTournament);
        };
    }, [session?.ss]);

    const openPromotionModal = () => {
        dispatch({ type: ModalEventActionType.TogglePromotionTournamentModal, payload: true });
    };

    return (
        isActive && (
            <div
                ref={togglePromotionTournamentBtnRef}
                className={`${styles["setting-button"]} ${styles[specialClassByDevice]}`}
                onClick={() => openPromotionModal()}
            >
                <span className={`icon-tournament ${styles["icon-tournament"]}`}>
                    {<span className={`hot-label ${styles["hot-label"]}`}>{t("hot")}</span>}
                </span>

                <Tooltip message={t("popupAnnouncement")} hoverWrapper={togglePromotionTournamentBtnRef} />
            </div>
        )
    );
};
export default IconPromotionTournament;
