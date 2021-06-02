import React, { useEffect, useRef } from "react";
import { FormatMessageToArray } from "../../../helpers/notice-helper";
import { v4 as uuidv4 } from "uuid";
import Styles from "./notice.module.scss";

interface Props {
    gameName?: string;
    roundId?: number;
    message: string;
    onClose?: () => void;
    duration: number;
    minBet?: number;
    maxBet?: number;
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

export const Notice: React.FC<Props> = ({ message, onClose, duration = 3, minBet = 0, maxBet = 0, gameName, roundId }) => {
    const opt = { gameName: gameName, gameRoundId: roundId, minBet: minBet, maxBet: maxBet };
    const messageFormat = FormatMessageToArray(message, opt);
    return (
        <BaseNotice onClose={onClose} duration={duration}>
            {messageFormat.map((value) => (
                <div key={uuidv4()}>{value}</div>
            ))}
        </BaseNotice>
    );
};

export const APIError: React.FC<Props> = ({ gameName, roundId, message, onClose, duration = 3, minBet = 0, maxBet = 0 }) => {
    const opt = { gameName: gameName, gameRoundId: roundId, minBet: minBet, maxBet: maxBet };
    const messageFormat = FormatMessageToArray(message, opt);
    return (
        <BaseNotice onClose={onClose} duration={duration}>
            {messageFormat.map((value, index) => (
                <div key={uuidv4()} className={`${index === 0 ? "font-weight-medium" : ""}`}>
                    {value}
                </div>
            ))}
        </BaseNotice>
    );
};
