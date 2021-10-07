import { Trans, useTranslation } from "next-i18next";
import React, { useEffect, useRef, useState } from "react";
import { isMobileOnly, isIOS } from "react-device-detect";

import { useAuthContext } from "../../../contexts/auth";
import { updateUserQuickBetSetting } from "../../../services/user-setting-service";
import BaseDialog from "../../shared/base-dialog";
import { ModalType } from "../../shared/base-dialog/type";
import ConfirmMessage from "../confirm-message";
import Styles from "./quick-bet-btn.module.scss";

export const QuickBetBtn: React.FC<{ enabledQuickBet: boolean; updateEnabledQuickBet: Function; isHeaderSetting: boolean }> = ({
    enabledQuickBet,
    updateEnabledQuickBet,
    isHeaderSetting,
}) => {
    const [isShowModalConfirm, setIsShowPopup] = useState(false);
    const [isShowTooltip, setIsShowTooltip] = useState(true);
    const tooltipRef = useRef<HTMLDivElement>(null);
    let deviceClass = "";
    if (isMobileOnly) {
        deviceClass = isIOS ? Styles["ios-device"] : Styles["android-device"];
    }
    const authContext = useAuthContext();
    const { t } = useTranslation();

    const confirmQuickBet = () => {
        setIsShowTooltip(false);
        closeModal();
        updateEnabledQuickBet(true);
        updateUserQuickBetSetting(authContext.session, true);
    };

    const closeModal = () => {
        setIsShowPopup(false);
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (isShowTooltip && tooltipRef && tooltipRef.current && !tooltipRef.current.contains(event.target)) {
                setIsShowTooltip(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [tooltipRef]);

    const onClickQuickBet = () => {
        if (!enabledQuickBet) {
            setIsShowPopup(true);
        } else {
            updateEnabledQuickBet(false);
            updateUserQuickBetSetting(authContext.session, false);
        }
    };

    const handleTurnOn = () => {
        setIsShowTooltip(false);
        confirmQuickBet();
    };

    const closeHintTooltip = () => {
        setIsShowTooltip(false);
        updateUserQuickBetSetting(authContext.session, false);
    };

    return (
        <div className={`${Styles["toggle"]} ${isHeaderSetting ? Styles["header-setting"] : Styles["bet-setting"]} ${deviceClass}`}>
            <div>
                {!enabledQuickBet && <div className={Styles["ripple-animation"]}></div>}
                <input
                    className={Styles["toggle-checkbox"]}
                    id="toggle-quickbet"
                    type={"checkbox"}
                    value={"Quick Bet"}
                    checked={!!enabledQuickBet}
                    onChange={onClickQuickBet}
                />
                <label className={Styles["toggle-btn"]} htmlFor="toggle-quickbet">
                    <div className={Styles["quick-bet-icon"]}></div>
                </label>
                <div className={Styles["one-click-bet"]} onClick={onClickQuickBet}>
                    1-Click Bet
                </div>
            </div>
            {isShowModalConfirm && !!enabledQuickBet === false && (
                <div className={Styles["modalConfirm"]}>
                    <div className={`${Styles["bg-opacity"]}`}></div>
                    <BaseDialog type={ModalType.Message} isOpen={isShowModalConfirm} onCloseModal={closeModal}>
                        <ConfirmMessage closeModal={closeModal} confirmQuickBet={confirmQuickBet} />
                    </BaseDialog>
                </div>
            )}
            {enabledQuickBet === undefined && isShowTooltip && (
                <div
                    ref={tooltipRef}
                    className={`popover-custom ${isMobileOnly ? `bottom ${Styles["isMobile"]}` : "top"} ${Styles["hint-one-click-bet"]} `}
                >
                    <div className={Styles.content}>
                        <Trans t={t}>{t("common:oneClickHintMsg")}</Trans>
                    </div>
                    <div className={Styles.action}>
                        <button className={`btn-grey ${Styles["btn"]}`} onClick={closeHintTooltip}>
                            {t("common:dismiss")}
                        </button>
                        <button className={`btn-orange ${Styles["btn"]}`} onClick={handleTurnOn}>
                            {t("common:turnOn")}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
