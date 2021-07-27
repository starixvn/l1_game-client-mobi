import React, { useEffect, useRef, useState } from "react";
import { isMobileOnly } from "react-device-detect";
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
    isPlaceBetPopup = false,
}: Props) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const classModal = `modal-${ModalType[type].toLocaleLowerCase()}`;
    const [style, setStyle] = useState(null);

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

    const buildPopupStyle = () => {
        return !isMobileOnly && isPlaceBetPopup ? { ...getCustomStyle(), ...ajustPopupPosition() } : getCustomStyle();
    };

    useEffect(() => {
        setStyle(buildPopupStyle());

        if (enableBackdrop) {
            document.body.classList.add("no-scroll");
        }

        return () => {
            if (enableBackdrop) {
                document.body.classList.remove("no-scroll");
            }
        };
    }, []);

    useEffect(() => {
        if (!isMobileOnly && isPlaceBetPopup) {
            ajustPopupPositionDidUpdate();
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    const ajustPopupPositionDidUpdate = () => {
        const bottomMargin = -10,
            gameContainerRect = gameBaseContainerRef.current.parentElement.parentElement.getBoundingClientRect();

        if (gameContainerRect.bottom - window.innerHeight > bottomMargin) {
            const gameContainerRect = gameBaseContainerRef.current.parentElement.parentElement.getBoundingClientRect(),
                popupRef = wrapperRef.current,
                popupTop = eventPosition.y - gameContainerRect.y - popupRef.getBoundingClientRect().height;

            let nextStyle = buildPopupStyle();
            nextStyle.top = `${popupTop}px`;
            nextStyle.bottom = "none";
            setStyle(nextStyle);
        }
    };

    const ajustPopupPosition = () => {
        const betContainerRect = gameBaseContainerRef.current.parentElement.getBoundingClientRect(),
            gameContainerRect = gameBaseContainerRef.current.parentElement.parentElement.getBoundingClientRect(),
            popupRight = Math.round(eventPosition.right - betContainerRect.right);

        let popupStyle = {
            top: `${eventPosition.y - gameContainerRect.y + eventPosition.height}px`,
            bottom: "none",
            left: `${eventPosition.x - gameContainerRect.x}px`,
            right: "none",
        };

        if (popupRight === 0) {
            popupStyle.right = "0px";
            popupStyle.left = "none";
        }

        return popupStyle;
    };

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
