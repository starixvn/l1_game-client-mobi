import React, { useEffect, useRef } from "react";
import { useTranslation, Trans } from "next-i18next";
import { numberWithCommas } from "../../../helpers/number-helper";
import Styles from "./notice.module.scss";
interface Props {
    gameName?: string;
    roundId?: number;
    message: string;
    onClose?: () => void;
    duration: number;
    minBet?: number;
    maxBet?: number;
    errorCode?: string;
    position?: any;
    isWarning? :boolean;
}

const BaseNotice: React.FC<{ onClose: () => void; duration: number; isOpen?: boolean; position: any; isWarning: boolean }> = ({
    children,
    onClose,
    duration,
    position,
    isOpen = true,
    isWarning = true
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
        <div ref={wrapperRef} style={position} className={`${Styles.notice} ${Styles[isWarning ? "warning" : "inform"]}`}>
            <span className={`icon-close ${Styles["icon-close"]}`} onClick={onClose}></span>
            {children}
        </div>
    );
};

export const Notice: React.FC<Props> = ({
    message,
    onClose,
    duration = 3,
    minBet = 0,
    maxBet = 0,
    gameName,
    roundId = 0,
    errorCode,
    position = {},
    isWarning = true
}) => {
    const opt = {
        gameName: gameName,
        roundId: roundId,
        minBet: numberWithCommas(+minBet),
        maxBet: numberWithCommas(+maxBet),
        errorCode: errorCode,
    };
    const { t } = useTranslation();
    return (
        <BaseNotice onClose={onClose} duration={duration} position={position} isWarning={isWarning}>
            <Trans t={t}>{t(message, opt)}</Trans>
        </BaseNotice>
    );
};
