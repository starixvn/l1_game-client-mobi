import React from "react";
import { TFunction } from "next-i18next";

import BaseDialog from "../../../../shared/base-dialog";
import Styles from "./bet-history-details.module.scss";

export interface Props {
    renderBetLogsDetails: Function;
    closeModalBetHistory: () => void;
    closeModalBetDetails: () => void;
    t: TFunction;
}

const BetHistoryDetailsContainer: React.FC<Props> = ({ renderBetLogsDetails, closeModalBetHistory, closeModalBetDetails, t }) => {
    return (
        <BaseDialog onCloseModal={closeModalBetDetails} enableBackdrop={true}>
            <div className={Styles["bet-log-details"]}>
                <div className={Styles["title"]} onClick={closeModalBetDetails}>
                    {t("details")}
                </div>
                <span className={`icon-close ${Styles["icon-close"]}`} onClick={closeModalBetHistory}></span>
                <div className={Styles["content"]}>{renderBetLogsDetails()}</div>
            </div>
        </BaseDialog>
    );
};

export default BetHistoryDetailsContainer;
