import React, { useEffect, useRef } from "react";
import Styles from "./styles.module.scss";
import { ModalType } from "./type";

type Props = {
    isOpen: boolean;
    onCloseModal: Function;
    children: React.ReactNode;
    type: ModalType;
};

const BaseDialog: React.FC<Props> = ({ children, onCloseModal, isOpen, type }: Props) => {
    const wrapperRef = useRef<HTMLDivElement>(null);

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
        <div ref={wrapperRef} className={`${Styles.popup} ${Styles[`modal-${ModalType[type].toLocaleLowerCase()}`]}`}>
            {children}
        </div>
    );
};

export default BaseDialog;
