import { useTheme } from "next-themes";
import React from "react";
import { isMobileOnly } from "react-device-detect";

import Styles from "./container.module.scss";
import { Themes } from "../../../common/constants/index";

const FirstLoginContainer: React.FC = ({ children }) => {
    const logoTheme = useTheme().theme === Themes.light ? "logo-custom-saba-orange" : "logo-custom-saba";

    return (
        <div className={`${Styles["wrapper"]} ${isMobileOnly ? Styles["mobile"] : ""}`}>
            <div className={Styles["page-bg"]}>
                <div className={Styles["page-container"]}>
                    <div className={Styles["logo"]}>
                        <img src={`/static/images/${logoTheme}.svg?v=3`} className="img-fluid" alt="logo" />
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default FirstLoginContainer;
