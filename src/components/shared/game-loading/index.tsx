import React from "react";
import Skeleton from "react-loading-skeleton";
import BaseDialog from "../base-dialog";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "next-i18next";
import { ModalType } from "../base-dialog/type";
import Styles from "./styles.module.scss";
type Props = {
    displayPopup: boolean;
    errorMessage: string | string[];
    retryConnect: () => void;
};

const GameLoading = (props: Props) => {
    const { displayPopup, errorMessage, retryConnect } = props;
    const { t } = useTranslation("common");
    const classBorder = "border-radius";
    const classScoreBoard = "score-board-line";
    const classSkeletonBackground = "skeleton-background";

    const renderMessage = () => {
        if (typeof errorMessage === "string") {
            return errorMessage;
        } else {
            return errorMessage.map((value) => <div key={uuidv4()}>{value}</div>);
        }
    };

    return (
        <div className={Styles.container}>
            <div className={Styles.header}>
                <div className={Styles["header-left"]}>
                    <Skeleton className={`${Styles[classBorder]} ${Styles[classSkeletonBackground]}`} width={157} />
                    <Skeleton className={`${Styles[classBorder]} ${Styles[classSkeletonBackground]}`} width={46} />
                </div>
                <Skeleton className={Styles[classSkeletonBackground]} circle={true} height={40} width={40} />
                <div className={Styles["header-right"]}>
                    <Skeleton className={`${Styles[classBorder]} ${Styles[classSkeletonBackground]}`} height={42} width={84} />
                    <Skeleton className={`${Styles[classBorder]} ${Styles[classSkeletonBackground]}`} height={42} width={14} />
                </div>
            </div>
            <div className={Styles["bet-container"]}>
                <Skeleton className={Styles[classSkeletonBackground]} height={273} />
            </div>
            <div className={Styles["mini-round-history"]}>
                <Skeleton className={`${Styles[classBorder]} ${Styles[classSkeletonBackground]}`} height={19} />
            </div>
            <div className={Styles["statistic"]}>
                <Skeleton className={`${Styles[classBorder]} ${Styles[classSkeletonBackground]}`} height={19} />
            </div>
            <div className={Styles.scoreboard}>
                <Skeleton className={`${Styles[classBorder]} ${Styles[classScoreBoard]}`} height={19} />
                <Skeleton className={`${Styles[classBorder]} ${Styles[classScoreBoard]}`} height={19} width={290} />
                <Skeleton className={`${Styles[classBorder]} ${Styles[classScoreBoard]}`} height={19} width={190} />
                <Skeleton className={`${Styles[classBorder]} ${Styles[classScoreBoard]}`} height={19} width={250} />
            </div>
            {displayPopup && (
                <BaseDialog type={ModalType.Center} isOpen={true} onCloseModal={() => {}}>
                    <div className={Styles["error-message-container"]}>
                        <div className={`icon-warning ${Styles["icon-warning"]}`}></div>
                        <div className={Styles.message} key={Math.random()}>
                            {errorMessage && renderMessage()}
                        </div>
                        <div className={Styles["list-action"]}>
                            <button onClick={() => retryConnect()} className={`btn-orange w-100 ${Styles["reconnect"]}`}>
                                {t("socketReconnect")}
                            </button>
                        </div>
                    </div>
                </BaseDialog>
            )}
        </div>
    );
};

export default GameLoading;
