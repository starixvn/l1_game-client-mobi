import React from "react";
import Styles from "./confirm-message.module.scss";
import { Props } from "./type";

const ConfirmMessage: React.FC<Props> = ({ t, message, closeModal, confirmQuickBet }) => {
    return (
        <div className="game-container">
            <div className={Styles["error-message-container"]}>
                <div className={Styles.message}>{t(message)}</div>
                <div className={Styles["list-button"]}>
                    <button className={`${Styles["btn-grey"]} ${Styles["btn-cancel"]}`} onClick={() => closeModal()}>
                        {t("cancel")}
                    </button>
                    <button className={`${Styles["btn-orange"]} ${Styles["btn-submit"]}`} onClick={() => confirmQuickBet()}>
                        {t("ok")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmMessage;
