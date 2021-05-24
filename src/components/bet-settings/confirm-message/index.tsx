import { useTranslation } from "next-i18next";
import React from "react";
import Styles from "./confirm-message.module.scss";
import { Props } from "./type";

const ConfirmMessage: React.FC<Props> = ({ closeModal, confirmQuickBet }) => {
    const { t } = useTranslation("common");

    return (
        <div className="game-container">
            <div className={Styles["error-message-container"]}>
                <div className={Styles["popup-closed-icon"]} onClick={() => closeModal()}>
                    <span className={`icon-close ${Styles["icon-close"]}`}></span>
                </div>

                <div className={Styles["popup-header"]}>
                    <h1 className={Styles["popup-title"]}>{t("oneClickTitle")}</h1>
                </div>
                <div className={Styles.message}>{t("messageConfirmQuickBet")}</div>
                <div className={Styles["list-button"]}>
                    <button className={`${Styles["btn-grey"]} ${Styles["btn"]}`} onClick={() => closeModal()}>
                        {t("cancel")}
                    </button>
                    <button className={`${Styles["btn-orange"]} ${Styles["btn"]}`} onClick={() => confirmQuickBet()}>
                        {t("turnOn")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmMessage;
