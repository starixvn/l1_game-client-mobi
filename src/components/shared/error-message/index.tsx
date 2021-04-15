import React, { useEffect } from "react";
import Styles from "./error-message.module.scss";
import { Props } from "./type";

const ErrorMessage: React.FC<Props> = ({ message, closeModal }) => {
    useEffect(() => {
        const timeOut = setTimeout(() => closeModal(), 2000);

        return () => {
            clearTimeout(timeOut);
        };
    }, []);

    return (
        <div className={Styles["error-message-container"]}>
            <div className={`icon-warning ${Styles["icon-warning"]}`}></div>
            <div className={`icon-close ${Styles["icon-close"]}`} onClick={() => closeModal()}></div>
            <div className={Styles.message}>{message}</div>
        </div>
    );
};

export default ErrorMessage;
