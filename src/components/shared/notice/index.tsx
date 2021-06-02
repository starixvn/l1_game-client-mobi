import React, { useEffect } from "react";

import Styles from "./notice.module.scss";

interface NoticeProps {
    message: string;
    onClose: () => void;
    duration: number;
}

interface APIErrorProps extends NoticeProps {
    gameName: string;
    roundId: number;
}

const BaseNotice: React.FC<{ onClose: () => void; duration: number }> = ({ children, onClose, duration }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, duration * 1000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={Styles.notice}>
            <span className={`icon-close ${Styles["icon-close"]}`}></span>
            {children}
        </div>
    );
};

export const Notice: React.FC<NoticeProps> = ({ message, onClose, duration = 3 }) => {
    return (
        <BaseNotice onClose={onClose} duration={duration}>
            {message}
        </BaseNotice>
    );
};

export const APIError: React.FC<APIErrorProps> = ({ gameName, roundId, message, onClose, duration = 3 }) => {
    return (
        <BaseNotice onClose={onClose} duration={duration}>
            <div className="font-weight-medium">{`${gameName} (#${roundId})`}</div>
            <div>{message}</div>
        </BaseNotice>
    );
};
