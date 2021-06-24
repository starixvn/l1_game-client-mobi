import React from "react";

import Styles from "./result-detail.module.scss";

const ResultDetail: React.FC<{ renderResultInfo: Function; renderSettlementInfo: Function }> = (props) => {
    return (
        <div className={Styles["result-detail-container"]}>
            <div className={Styles["result-info"]}>{props.renderResultInfo()}</div>
            <div className={Styles["settlement-info"]}>{props.renderSettlementInfo()}</div>
        </div>
    );
};

export default ResultDetail;
