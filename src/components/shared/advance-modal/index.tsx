import { useTranslation } from "next-i18next";
import React, { useEffect, useRef, useState } from "react";
import { isMobileOnly } from "react-device-detect";
import BaseDialog from "../base-dialog";
import { ModalType } from "../base-dialog/type";
import Styles from "./advance-dialog.module.scss";

type Props = {
    isOpen: boolean;
    type?: ModalType;
    onCloseModal: Function;
    children: React.ReactNode;
    title: string;
    subTitle?: string;
    gameName?: string;
    isAddScrollBody?: boolean;
};

const AdvanceModal: React.FC<Props> = ({
    title,
    subTitle,
    children,
    onCloseModal,
    isOpen,
    type = ModalType.Full,
    gameName,
    isAddScrollBody = false,
}: Props) => {
    const { t } = useTranslation("common");
    const ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const currentPosition = ref.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        windowHeight / currentPosition.y > 2
            ? ref.current.scrollIntoView({ block: "end" })
            : ref.current.scrollIntoView({ block: "start" });
    }, [ref.current]);
    useEffect(() => {
        isMobileOnly && isAddScrollBody && document.body.classList.add("no-scroll");
        return () => {
            isMobileOnly && isAddScrollBody && document.body.classList.remove("no-scroll");
        };
    }, []);

    return (
        <BaseDialog isOpen={isOpen} onCloseModal={onCloseModal} type={type}>
            <div className={`${Styles.modal}`} ref={ref}>
                <div className={Styles["popup-closed-icon"]} onClick={() => onCloseModal()}>
                    <span className={`icon-close {Styles["icon-close"]}`}></span>
                </div>

                <div className={Styles["popup-header"]}>
                    <h1 className={Styles["popup-title"]}>{t(title)}</h1>
                    {subTitle && <p className={Styles["popup-sub-title"]}>{t(subTitle)}</p>}
                    {gameName && <p className={Styles["popup-game-name"]}>{gameName}</p>}
                </div>
                <div
                    className={`${Styles["popup-content"]} ${subTitle ? Styles["has-subtitle"] : ""} ${
                        gameName ? Styles["has-gameName"] : ""
                    }`}
                >
                    {children}
                </div>
            </div>
        </BaseDialog>
    );
};

export default AdvanceModal;
