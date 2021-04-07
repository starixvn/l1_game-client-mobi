import React, { useEffect, useRef } from "react";

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
                <span className={Styles["icon-small-logo"]}></span>
            </div>
            <div className={Styles["popup-closed-icon"]} onClick={() => onCloseModal()}>
                <span className={Styles["icon-close"]}></span>
            </div>
            <div className={Styles["popup-header"]}>
                <h1 className={Styles["popup-title"]}>{title}</h1>
                {subTitle && <p className={Styles["popup-sub-title"]}>{subTitle}</p>}
            </div>
            <div>{children}</div>
        </div>
    );
};

export default BaseModal;
