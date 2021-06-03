import React, { useEffect, useRef } from "react";

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

const BaseNotice: React.FC<{ onClose: () => void; duration: number; isOpen?: boolean }> = ({
    children,
    onClose,
    duration,
    isOpen = true,
}) => {
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(onClose, duration * 1000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (isOpen && wrapperRef && wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                onClose && onClose();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    return (
        <div ref={wrapperRef} className={Styles.notice}>
            <span className={`icon-close ${Styles["icon-close"]}`} onClick={onClose}></span>
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
