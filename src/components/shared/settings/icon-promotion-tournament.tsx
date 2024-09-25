import styles from "./settings.module.scss";
import axios from "axios";

import React, { useEffect, useRef, useState } from "react";
import { isMobileOnly } from "react-device-detect";
import { useTranslation } from "next-i18next";
import { Tooltip } from "../tooltip";
import { ModalEventActionType, useModalDispatch } from "../../../contexts/modal-context";
import { useAuthContext } from "../../../contexts/auth";
import { buildPromotionSiteUrl } from "../../../helpers/url-helper";
import { getLocalStorageItem, localStorageKeys, removeLocalStorageItem, storeLocalStorageItem } from "../../../common/local-storage";

const getPromotionTournamentNotification = async (params: { sessionId: string, username: string }) => {
    try {
        const searchParams = new URLSearchParams();
        Object.keys(params).forEach((key) => params[key] !== undefined && searchParams.append(key, params[key]));
        const url = `${buildPromotionSiteUrl()}/notification/exist-promotion-tournament?${searchParams.toString()}`;
        const response = await axios.get(url);

        return response.data?.data;
    } catch (error) {
        console.error(`Get promotion tournament failed: ${error.message}`);
    }

    return {
        isExistedNotification: false,
        numerousNewOrRunningTournament: 0
    };
};

export const IconPromotionTournament = () => {
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
        const trackedOpenTournamentPopupKey = `${localStorageKeys.trackedOpenTournamentPopup}_${params.sessionId}`

        const checkPromotionTournament = async () => {
            const notification = await getPromotionTournamentNotification(params);
            if (notification?.numerousNewOrRunningTournament > 0) {

                const trackedOpenTournamentPopup = getLocalStorageItem<number>(trackedOpenTournamentPopupKey) ?? 0;

                trackedOpenTournamentPopup === 0 && dispatch({ type: ModalEventActionType.TogglePromotionTournamentModal, payload: true });;
                storeLocalStorageItem(trackedOpenTournamentPopupKey, trackedOpenTournamentPopup + 1);
            }

            setIsActive(notification.isExistedNotification);
        };

        if (session?.ss) {
            checkPromotionTournament();
            intervalPromotionTournament && clearInterval(intervalPromotionTournament);
            intervalPromotionTournament = setInterval(() => {
                checkPromotionTournament();
            }, 1000 * 60 * 10);
        }

        return () => {
            removeLocalStorageItem(trackedOpenTournamentPopupKey);
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

                <span className={`icon-tournament ${styles["icon-tournament"]}`}>{<span className={`hot-label ${styles["hot-label"]}`} >{t("hot")}</span>}</span>

                <Tooltip message={t("popupAnnouncement")} hoverWrapper={togglePromotionTournamentBtnRef} />
            </div>
        )
    );
};
