import React from "react";

import { numberWithCommas } from "../../../../helpers/number-helper";
import Styles from "./styles.module.scss";

const WinningBet: React.FC<{ amount: number }> = ({ amount }) => {
    return <div className={Styles["winning-bet"]}>{`+${numberWithCommas(amount)}`}</div>;
};

export default WinningBet;
