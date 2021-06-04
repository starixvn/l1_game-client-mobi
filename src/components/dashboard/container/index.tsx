import React from "react";

import Styles from "./container.module.scss";

const FirstLoginContainer: React.FC = ({ children }) => {
    return (
        <div className={Styles["wrapper"]}>
            <div className={Styles["page-bg"]}>
                <div className={Styles["page-container"]}>
                    <div className={Styles["logo"]}>
                        <img src={`/static/images/logo-custom-saba.svg`} className="img-fluid" alt="logo" />
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default FirstLoginContainer;
