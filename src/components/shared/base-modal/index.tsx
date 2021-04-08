import React, { useEffect, useRef } from "react";
import { useTranslation } from "next-i18next";

import Styles from "./base-modal.module.scss";

type Props = {
    isOpen: boolean;
    isSmall?: boolean;
    onCloseModal: Function;
    children: React.ReactNode;
    title: string;
    subTitle?: string;
};

const BaseModal: React.FC<Props> = ({ title, subTitle, children, onCloseModal, isOpen, isSmall = false }: Props) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation("common");

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
        <div ref={wrapperRef} className={` ${Styles["popup"]} ${isSmall ? Styles.small : ""}`}>
            <div className={Styles["popup-logo"]}>
                <span className="icon-small-logo"></span>
            </div>
            <div className={Styles["popup-closed-icon"]} onClick={() => onCloseModal()}>
                <span className="icon-close"></span>
            </div>
            <div className={Styles["popup-header"]}>
                <h1 className={Styles["popup-title"]}>{t(title)}</h1>
                {subTitle && <p className={Styles["popup-sub-title"]}>{t(subTitle)}</p>}
            </div>
            <div>{children}</div>
        </div>
    );
};

export default BaseModal;
