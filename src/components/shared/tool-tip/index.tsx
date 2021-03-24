import React from "react";
import { Props } from "./tooltip";

import Styles from "./tooltip.module.scss";

export const ToolTip: React.FC<Props> = (props: Props) => {
    return <div className={Styles["tooltip"]}>{props.children}</div>;
};

export const ToolTipChild: React.FC<Props> = (props) => {
    return <div className={Styles["tooltiptext"]}>{props.children}</div>;
};
