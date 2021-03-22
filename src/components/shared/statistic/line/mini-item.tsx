import React from "react";
import styles from "../statistic.module.scss";

import { MiniItemType } from "../type";

type Props = {
    result: MiniItemType;
};

export default function MiniItem(props: Props) {
    const { result } = props;
    return <div className={styles[result.class]}></div>;
}
