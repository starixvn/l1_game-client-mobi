import React from "react";
import Styles from "./confirm-message.module.scss";
import { Props } from "./type";

const ConfirmMessage: React.FC<Props> = ({ t, message, closeModal, confirmQuickBet }) => {
    return (
        <div className={Styles["error-message-container"]}>
            <div className={Styles.message}>{t(message)}</div>
            <button className={`${Styles["btn-orange"]} ${Styles["btn-cancel"]}`} onClick={() => closeModal()}>
                {t("cancel")}
            </button>
            <button className={`${Styles["btn-orange"]} ${Styles["btn-submit"]}`} onClick={() => confirmQuickBet()}>
                {t("ok")}
            </button>
        </div>
    );
};

export default ConfirmMessage;
