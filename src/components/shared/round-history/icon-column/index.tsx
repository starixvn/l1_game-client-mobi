import React from "react";
import { Props } from "./icon-column";

const IconColumn = (props: Props) => {
    return <div className="score-board-col">{props.children}</div>;
};

export default IconColumn;
