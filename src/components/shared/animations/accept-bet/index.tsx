import React from "react";

import { numberWithCommas } from "../../../../helpers/number-helper";
import Styles from "./styles.module.scss";

const AcceptBet: React.FC<{ amount: number }> = ({ amount }) => {
    return <div className={`${Styles["accepted-bet"]}`}>{`-${numberWithCommas(amount)}`}</div>;
};

export default AcceptBet;
