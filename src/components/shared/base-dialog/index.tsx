import React, { useEffect, useRef, useState } from "react";
import { isMobileOnly } from "react-device-detect";
import Styles from "./base-dialog.module.scss";
import { ModalType } from "./type";

const HeaderHeightInPixel = 55;

type Props = {
    isOpen?: boolean;
    onCloseModal?: Function;
    children?: React.ReactNode;
    type?: ModalType;
    betContainerPosition?: number;
    isCloseOutside?: boolean;
    enableBackdrop?: boolean;
};

const BaseDialog: React.FC<Props> = ({
    children,
    onCloseModal = null,
    isOpen = true,
    type = ModalType.Full,
    betContainerPosition,
    enableBackdrop,
}: Props) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const classModal = `modal-${ModalType[type].toLocaleLowerCase()}`;

    const getCustomStyle = () => {
        const browserHeight = window.innerHeight;

        if (betContainerPosition != null) {
            return browserHeight / betContainerPosition > 2
                ? { top: `${betContainerPosition}px` }
                : { bottom: `${browserHeight - betContainerPosition + HeaderHeightInPixel}px`, top: "auto" };
        }

        return {};
    };

    const handleClickOutside = (event: any) => {
        if (isOpen && wrapperRef && wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            onCloseModal && onCloseModal();
        }
    };

    useEffect(() => {
        enableBackdrop && document.body.classList.add("no-scroll");

        return () => {
            enableBackdrop && document.body.classList.remove("no-scroll");
        };
    }, []);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    return (
        <>
            {enableBackdrop && !isMobileOnly && <div className={`overlay-mask ${Styles["overlay"]}`}></div>}
            <div
                style={getCustomStyle()}
                ref={wrapperRef}
                className={`${Styles.popup} ${Styles[classModal]} ${isMobileOnly ? Styles["isMobile"] : ""}`}
            >
                {children}
            </div>
        </>
    );
};

export default BaseDialog;
