import React from "react";
import Styles from "./simple-popup.module.scss";

type Props = {
    children?: React.ReactNode;
};

const SimplePopup: React.FC<Props> = ({ children }: Props) => {
    return (
        <div className={Styles[`popup`]}>
            <div className={Styles[`popup_inner`]}>{children}</div>
        </div>
    );
};

export default SimplePopup;
