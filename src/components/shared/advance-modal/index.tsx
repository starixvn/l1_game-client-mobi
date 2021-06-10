import { useTranslation } from "next-i18next";
import React, { useEffect, useRef } from "react";
import { isMobileOnly } from "react-device-detect";
import { useSystemContext } from "../../../contexts/system";
import BaseDialog from "../base-dialog";
import { ModalType } from "../base-dialog/type";
import Styles from "./advance-dialog.module.scss";

type Props = {
    isOpen: boolean;
    type?: ModalType;
    onCloseModal: Function;
    children: React.ReactNode;
    title?: string;
    subTitle?: string;
    gameName?: string;
    isAddScrollBody?: boolean;
    gameId: number;
};

const getNumOfGamesInOneRow = () => {
    const windowWidth = window.innerWidth;
    const criteria = [
        {
            condition: windowWidth >= 1098,
            result: 3,
        },
        {
            condition: windowWidth >= 768,
            result: 2,
        },
        {
            condition: windowWidth >= 1,
            result: 1,
        },
    ];

    return criteria.find((criteria) => criteria.condition === true).result;
};

const getModalPositionByRow = (row: number, totalRow: number) => {
    switch (row) {
        case 1:
            return "end";
        case totalRow:
            return "start";
        default:
            return "center";
    }
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
    gameId,
}: Props) => {
    const { t } = useTranslation("common");
    const ref = useRef<HTMLInputElement>(null);
    const { gamesOrder } = useSystemContext();

    useEffect(() => {
        const totalGames = gamesOrder.length;
        const gameIndex = gamesOrder.findIndex((id) => id === gameId);
        const numberOfGamesInOneRow = getNumOfGamesInOneRow();
        const numberOfRows = totalGames / numberOfGamesInOneRow;
        const modalPosition = getModalPositionByRow(Math.ceil((gameIndex + 1) / numberOfGamesInOneRow), numberOfRows);

        ref.current.scrollIntoView({ block: modalPosition });
    }, []);

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

                {title && (
                    <div className={Styles["popup-header"]}>
                        <h1 className={Styles["popup-title"]}>{t(title)}</h1>
                        {subTitle && <p className={Styles["popup-sub-title"]}>{t(subTitle)}</p>}
                        {gameName && <p className={Styles["popup-game-name"]}>{gameName}</p>}
                    </div>
                )}
                <div
                    className={`${Styles["popup-content"]} ${subTitle ? Styles["has-subtitle"] : ""} ${
                        gameName ? Styles["has-gameName"] : ""
                    } ${!title ? Styles["has-empty-title"] : ""}`}
                >
                    {children}
                </div>
            </div>
        </BaseDialog>
    );
};

export default AdvanceModal;
