import React, { useEffect, useRef } from "react";
import { useGameContext } from "../../../contexts/game-context/game-context";
import Styles from "./base-dialog.module.scss";
import { ModalType } from "./type";

type Props = {
    isOpen?: boolean;
    onCloseModal?: Function;
    children?: React.ReactNode;
    type?: ModalType;
};

const BaseDialog: React.FC<Props> = ({ children, onCloseModal = null, isOpen = true, type = ModalType.Full }: Props) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const { isCompactMode } = useGameContext();

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
            ref={wrapperRef}
            className={`${Styles.popup} ${Styles[`modal-${ModalType[type].toLocaleLowerCase()}`]} ${
                isCompactMode ? Styles["compact-mode"] : ""
            }`}
        >
            {children}
        </div>
    );
};

export default BaseDialog;
