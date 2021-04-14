import React, { useEffect } from "react";
import styles from "./error-message.module.scss";
import { Props } from "./type";

const ErrorMessage: React.FC<Props> = ({ message, closeModal }) => {
    useEffect(() => {
        const timeOut = setTimeout(() => closeModal(), 3000);

        return () => {
            clearTimeout(timeOut);
        };
    }, []);

    return (
        <div className={styles["error-message-container"]}>
            <div className={styles.header}>
                <span className="icon-close" onClick={() => closeModal()}></span>
            </div>
            <div className={styles.message}>{message}</div>
        </div>
    );
};

export default ErrorMessage;
