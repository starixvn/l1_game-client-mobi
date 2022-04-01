import React from "react";
import { isMobileOnly } from "react-device-detect";

import Styles from "./container.module.scss";

const FirstLoginContainer: React.FC = ({ children }) => {
    return (
        <div className={`${Styles["wrapper"]} ${isMobileOnly ? Styles["mobile"] : ""}`}>
            <div className={Styles["page-bg"]}>
                <div className={Styles["page-container"]}>
                    <div className={Styles["logo"]}>
                        <img src={`/static/images/logo-custom-saba.svg?v=3`} className="img-fluid" alt="logo" />
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default FirstLoginContainer;
