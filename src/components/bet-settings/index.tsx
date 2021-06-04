import { useTranslation, Trans } from "next-i18next";
import React, { useEffect, useRef, useState } from "react";

import { useAuthContext } from "../../contexts/auth";
import { UserClientCommunication } from "../../services";
import BaseDialog from "../shared/base-dialog";
import { ModalType } from "../shared/base-dialog/type";
import Styles from "./bet-setting.module.scss";
import { ChipSlider } from "./chip-slider";
import ConfirmMessage from "./confirm-message";

type Props = {
    betValue: number;
    updateBetValue: (betValue: number) => void;
    enabledQuickBet: boolean;
    updateEnabledQuickBet: (value: boolean) => void;
};

export const BetSettings: React.FC<Props> = ({ betValue, updateBetValue, enabledQuickBet, updateEnabledQuickBet }) => {
    const [isShowModalConfirm, setIsShowPopup] = useState(false);
    const [isShowTooltip, setIsShowTooltip] = useState(true);
    const authContext = useAuthContext();
    const tooltipRef = useRef<HTMLDivElement>(null);
    const userSettingsService = UserClientCommunication.getUserClientInstance().userSettings;

    const { t } = useTranslation("common");

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
            userSettingsService.updateUserQuickBetSetting(authContext.session.ss, authContext.session.username, false);
        }
    };

    const confirmQuickBet = () => {
        setIsShowTooltip(false);
        closeModal();
        updateEnabledQuickBet(true);
        userSettingsService.updateUserQuickBetSetting(authContext.session.ss, authContext.session.username, true);
    };

    const closeModal = () => {
        setIsShowPopup(false);
    };

    const closeHintTooltip = () => {
        setIsShowTooltip(false);
        userSettingsService.updateUserQuickBetSetting(authContext.session.ss, authContext.session.username, false);
    };

    const handleTurnOn = () => {
        setIsShowTooltip(false);
        confirmQuickBet();
    };

    return (
        <div className={Styles["bet-settings"]}>
            <div className={Styles["settings-container"]}>
                <div className={`game-container ${Styles["container"]}`}>
                    <div className={Styles["wrapper-chips"]}>
                        <div className={`${Styles["toggle"]}`}>
                            <div className={enabledQuickBet ? "heart-beat-animation" : ""}>
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
                                    <div className={Styles.chip}>
                                        <div className={Styles["layer1"]}></div>
                                        <div className={Styles["layer2"]}></div>
                                        <div className={Styles["group-list"]}>
                                            <span className={`icon-chip-symbol ${Styles["symbol1"]}`}></span>
                                            <span className={`icon-chip-symbol ${Styles["symbol2"]}`}></span>
                                            <span className={`icon-chip-symbol ${Styles["symbol3"]}`}></span>
                                            <span className={`icon-chip-symbol ${Styles["symbol4"]}`}></span>
                                        </div>
                                        <div className={Styles["icon-quick-bet"]}></div>
                                    </div>
                                </label>
                                <div className={Styles["one-click-bet"]}>1-Click Bet</div>
                            </div>
                            {enabledQuickBet === undefined && isShowTooltip && (
                                <div ref={tooltipRef} className={`popover-custom top ${Styles["hint-one-click-bet"]}`}>
                                    <div className={Styles.content}>
                                        <Trans t={t}>{t("common:oneClickHintMsg")}</Trans>
                                    </div>
                                    <div className={Styles.action}>
                                        <button className={`btn-grey ${Styles["btn"]}`} onClick={() => closeHintTooltip()}>
                                            {t("common:dismiss")}
                                        </button>
                                        <button className={`btn-orange ${Styles["btn"]}`} onClick={() => handleTurnOn()}>
                                            {t("common:turnOn")}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className={Styles["chips-container"]}>
                            <ChipSlider betValue={betValue} updateBetValue={updateBetValue} />
                        </div>
                    </div>
                </div>
            </div>

            {isShowModalConfirm && !!enabledQuickBet === false && (
                <div className={Styles["modalConfirm"]}>
                    <div className={Styles["bg-opacity"]}></div>
                    <BaseDialog type={ModalType.Message} isOpen={isShowModalConfirm} onCloseModal={closeModal}>
                        <ConfirmMessage closeModal={closeModal} confirmQuickBet={confirmQuickBet} />
                    </BaseDialog>
                </div>
            )}
        </div>
    );
};
