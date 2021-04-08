import React from "react";
import { Props } from "./icon-column";
import Styles from "./icon-column.module.scss";

const IconColumn = (props: Props) => {
    return <div className={Styles["board-col"]}>{props.children}</div>;
};

export default IconColumn;
