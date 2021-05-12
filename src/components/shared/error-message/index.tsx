import React, { useEffect, useState } from "react";

import Styles from "./error-message.module.scss";
import { Props } from "./type";

const ErrorMessage: React.FC<Props> = ({ message, closeModal }) => {
    useEffect(() => {
        const timeOut = setTimeout(() => closeModal(), 3000);

        return () => {
            clearTimeout(timeOut);
        };
    }, []);

    const renderMessage = () => {
        if (typeof message === "string") {
            return message;
        } else {
            return message.map((value, index) => (
                <>
                    {index ? <br /> : ""}
                    {value}
                </>
            ));
        }
    };

    return (
        <div className={Styles["error-message-container"]}>
            <div className={`icon-warning ${Styles["icon-warning"]}`}></div>
            <div className={`icon-close ${Styles["icon-close"]}`} onClick={() => closeModal()}></div>
            <div className={Styles.message}>{message && renderMessage()}</div>
        </div>
    );
};

export default ErrorMessage;
