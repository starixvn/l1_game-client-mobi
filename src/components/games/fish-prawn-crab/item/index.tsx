import React from "react";

type Props = {
    type: number;
};

const Item: React.FunctionComponent<Props> = ({ type }) => {
    let iconName = "";
    switch (type) {
        case 1:
            iconName = "icon-bau";
            break;
        case 2:
            iconName = "icon-ga";
            break;
        case 3:
            iconName = "icon-ca";
            break;
        case 4:
            iconName = "icon-cua";
            break;
        case 5:
            iconName = "icon-tom";
            break;
        default:
            iconName = "icon-nai";
            break;
    }

    return <div className={`score-board-item ${iconName}`}></div>;
};

export default Item;
