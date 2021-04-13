import React from "react";
import { useTranslation } from "next-i18next";
import BaseDialog from "../base-dialog";

import Styles from "./styles.module.scss";
import { ModalType } from "../base-dialog/type";

type Props = {
    isOpen: boolean;
    type?: ModalType;
    onCloseModal: Function;
    children: React.ReactNode;
    title: string;
    subTitle?: string;
};

const AdvanceModal: React.FC<Props> = ({ title, subTitle, children, onCloseModal, isOpen, type = ModalType.Full }: Props) => {
    const { t } = useTranslation("common");

    return (
        <BaseDialog isOpen={isOpen} onCloseModal={onCloseModal} type={type}>
            <div className={Styles.modal}>
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
                <div className={Styles["popup-content"]}>{children}</div>
            </div>
        </BaseDialog>
    );
};

export default AdvanceModal;
