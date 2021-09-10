import React from "react";

import { Props } from "./bet-history-detail";
import BaseDialog from "../../../../shared/base-dialog";
import Styles from "./bet-history-details.module.scss";

const BetHistoryDetailsContainer: React.FC<Props> = ({
    renderBetLogsDetails,
    renderResultDetail,
    isShowResultDetail,
    closeModalBetHistory,
    closeModalBetDetails,
    translateText,
}) => {
    return (
        <BaseDialog onCloseModal={closeModalBetDetails} enableBackdrop={true}>
            <div className={Styles["bet-log-details"]}>
                <div className={Styles["back"]} onClick={closeModalBetDetails}>
                    {translateText.betDetails}
                </div>
                <span className={`icon-close ${Styles["icon-close"]}`} onClick={closeModalBetHistory}></span>
                {renderBetLogsDetails}
            </div>
            {isShowResultDetail && renderResultDetail}
        </BaseDialog>
    );
};

export default BetHistoryDetailsContainer;
