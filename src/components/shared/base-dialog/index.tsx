import React, { useEffect, useRef } from "react";
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
    toggleBtnRef?: React.MutableRefObject<HTMLElement>;
};

const BaseDialog: React.FC<Props> = ({
    children,
    onCloseModal = null,
    isOpen = true,
    type = ModalType.Full,
    betContainerPosition,
    enableBackdrop,
    toggleBtnRef,
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

    useEffect(() => {
        enableBackdrop && document.body.classList.add("no-scroll");

        return () => {
            enableBackdrop && document.body.classList.remove("no-scroll");
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (isOpen && !wrapperRef?.current?.contains(event.target) && !toggleBtnRef?.current?.contains(event.target)) {
                onCloseModal && onCloseModal();
            }
        };

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
