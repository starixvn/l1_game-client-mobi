import React, { useEffect, useRef } from "react";
import { useGameContext } from "../../../contexts/game-context/game-context";
import Styles from "./base-dialog.module.scss";
import { ModalType } from "./type";

const HeaderHeightInPixel = 55;

type Props = {
    isOpen?: boolean;
    onCloseModal?: Function;
    children?: React.ReactNode;
    type?: ModalType;
    betContainerPosition?: number;
};

const BaseDialog: React.FC<Props> = ({
    children,
    onCloseModal = null,
    isOpen = true,
    type = ModalType.Full,
    betContainerPosition,
}: Props) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const { isCompactMode } = useGameContext();
    const classModal = `modal-${ModalType[type].toLocaleLowerCase()}`;

    const getCustomStyle = () => {
        const windowHeight = window.innerHeight;

        return windowHeight / betContainerPosition > 2
            ? { top: `${betContainerPosition}px` }
            : { bottom: `${windowHeight - betContainerPosition + HeaderHeightInPixel}px`, top: "auto" };
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (isOpen && wrapperRef && wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                onCloseModal();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    return (
        <div
            style={betContainerPosition && getCustomStyle()}
            ref={wrapperRef}
            className={`${Styles.popup} ${Styles[classModal]} ${isCompactMode ? Styles["compact-mode"] : ""}`}
        >
            {children}
        </div>
    );
};

export default BaseDialog;
