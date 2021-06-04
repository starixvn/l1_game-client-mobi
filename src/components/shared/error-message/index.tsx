import { useTranslation, Trans } from "next-i18next";
import React, { useEffect } from "react";
import { useGameContext } from "../../../contexts/game-context/game-context";
import BaseDialog from "../base-dialog";
import { ModalType } from "../base-dialog/type";
import Styles from "./error-message.module.scss";
import { Props } from "./type";

export const ErrorMessage: React.FC<Props> = ({ message, closeModal }) => {
    const { isCompactMode } = useGameContext();
    useEffect(() => {
        const timeOut = setTimeout(() => closeModal(), 3000);

        return () => {
            clearTimeout(timeOut);
        };
    }, []);

    return (
        <div className={`${Styles["error-message-container"]} ${isCompactMode ? Styles["compact-mode"] : ""}`}>
            <div className={`icon-warning ${Styles["icon-warning"]}`}></div>
            <div className={`icon-close ${Styles["icon-close"]}`} onClick={() => closeModal()}></div>
            <div className={Styles.message} key={Math.random()}>
                {message}
            </div>
        </div>
    );
};

export const ConnectFailedMessage: React.FC<{ gameName: string; retryConnect: () => void }> = ({ gameName, retryConnect }) => {
    const { t } = useTranslation("messages");
    return (
        <BaseDialog type={ModalType.Center} isOpen={true}>
            <div className={Styles["error-message-container"]}>
                <div className={`icon-warning ${Styles["icon-warning"]}`}></div>
                <div className={Styles.message}>
                    <Trans t={t}>{t("lostGameConnection", { gameName: gameName })}</Trans>
                </div>
                <div className={Styles["list-action"]}>
                    <button onClick={() => retryConnect()} className={`btn-orange w-100 ${Styles["reconnect"]}`}>
                        {t("common:socketReconnect")}
                    </button>
                </div>
            </div>
        </BaseDialog>
    );
};
