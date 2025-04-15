import React, { useEffect, useState } from "react";

import Styles from "./result-detail.module.scss";

export const HidingAnimationDurationInSecond = 0.5;

const ResultDetail: React.FC<{ renderSettlementInfo: Function; timeToShowInSecond: number }> = (props) => {
    const [bindHideAnimationClass, setBindHideAnimationClass] = useState(false);

    useEffect(() => {
        const timeOut = setTimeout(() => {
            setBindHideAnimationClass(true);
        }, (props.timeToShowInSecond - HidingAnimationDurationInSecond) * 1000);

        return () => {
            clearTimeout(timeOut);
        };
    }, []);

    const renderContent = () => {
        try {
            return props.renderSettlementInfo();
        } catch (error) {
            console.error("Failed to render settlement info:", error);
            return <div>error</div>;
        }
    };

    return (
        <div className={`${Styles["result-detail-container"]} ${bindHideAnimationClass ? Styles["hide-result-animation"] : ""}`}>
            {renderContent()}
        </div>
    );
};

export default ResultDetail;
