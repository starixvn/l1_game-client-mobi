import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useGameContext } from "../../../contexts/game-context/game-context";
import Styles from "./error-message.module.scss";
import { Props } from "./type";

const ErrorMessage: React.FC<Props> = ({ message, closeModal }) => {
    const { isCompactMode } = useGameContext();
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
            return message.map((value, index) => <div key={uuidv4()}>{value}</div>);
        }
    };

    return (
        <div className={`${Styles["error-message-container"]} ${isCompactMode ? Styles["compact-mode"] : ""}`}>
            <div className={`icon-warning ${Styles["icon-warning"]}`}></div>
            <div className={`icon-close ${Styles["icon-close"]}`} onClick={() => closeModal()}></div>
            <div className={Styles.message} key={Math.random()}>
                {message && renderMessage()}
            </div>
        </div>
    );
};

export default ErrorMessage;
