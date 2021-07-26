import React, { useEffect, useRef } from "react";
import { isMobileOnly, isIOS } from "react-device-detect";

import Styles from "./base-dialog.module.scss";
import { ModalType } from "./type";
import { EventPosition } from "../game-base/type";

const HeaderHeightInPixel = 55;

type Props = {
    isOpen?: boolean;
    onCloseModal?: Function;
    children?: React.ReactNode;
    type?: ModalType;
    betContainerPosition?: number;
    isCloseOutside?: boolean;
    enableBackdrop?: boolean;
    eventPosition?: EventPosition;
    gameBaseContainerRef?: any;
    gameHeaderRef?: any;
    isPlaceBetPopup?: boolean;
};

const BaseDialog: React.FC<Props> = ({
    children,
    onCloseModal = null,
    isOpen = true,
    type = ModalType.Full,
    betContainerPosition,
    enableBackdrop,
    eventPosition,
    gameBaseContainerRef,
    gameHeaderRef,
    isPlaceBetPopup = false,
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
        if (!isMobileOnly && isPlaceBetPopup && wrapperRef.current.getBoundingClientRect().bottom > window.innerHeight) {
            wrapperRef.current.style.top = `${-eventPosition.height}px`;
            wrapperRef.current.style.bottom = `none`;
        }

        function handleClickOutside(event: any) {
            if (isOpen && wrapperRef && wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                onCloseModal && onCloseModal();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    useEffect(() => {
        if (enableBackdrop) {
            document.body.classList.add("no-scroll");
        }

        return () => {
            if (enableBackdrop) {
                document.body.classList.remove("no-scroll");
            }
        };
    }, []);

    const ajustPopupPosition = () => {
        const gameHeaderRect = gameHeaderRef.current.getBoundingClientRect(),
            gameBaseContainerRect = gameBaseContainerRef.current.getBoundingClientRect(),
            betContainerRect = gameBaseContainerRef.current.parentElement.getBoundingClientRect(),
            gameContainerRect = gameBaseContainerRef.current.parentElement.parentElement.getBoundingClientRect();
        const popupBottom = gameContainerRect.bottom - gameBaseContainerRect.bottom - gameHeaderRect.height - eventPosition.height;
        const popupLeft = Math.round(betContainerRect.left - eventPosition.left);
        const popupRight = Math.round(eventPosition.right - betContainerRect.right);

        if (popupBottom > 0) {
            if (popupLeft === 0) {
                return { bottom: `${popupBottom}px`, top: "none", left: `0px`, right: `none` };
            }

            if (popupRight === 0) {
                return { bottom: `${popupBottom}px`, top: "none", left: `none`, right: "0px" };
            }

            return { bottom: `${popupBottom}px`, top: "none", left: `0px`, right: "none" };
        } else {
            if (popupLeft === 0) {
                return { bottom: "none", top: `${gameHeaderRect.height}px`, left: `none`, right: `${popupLeft}px` };
            }

            if (popupRight === 0) {
                return { bottom: "none", top: `${gameHeaderRect.height}px`, left: `0px`, right: "none" };
            }

            return { bottom: "none", top: `${gameHeaderRect.height}px`, left: `0px`, right: "none" };
        }
    };

    const style = !isMobileOnly && isPlaceBetPopup ? { ...getCustomStyle(), ...ajustPopupPosition() } : getCustomStyle();
    return (
        <>
            {enableBackdrop && !isMobileOnly && <div className={`overlay-mask ${Styles["overlay"]}`}></div>}
            <div
                style={style}
                ref={wrapperRef}
                className={`${Styles.popup} ${Styles[classModal]} ${isMobileOnly ? Styles["isMobile"] : ""}`}
            >
                {children}
            </div>
        </>
    );
};

export default BaseDialog;
