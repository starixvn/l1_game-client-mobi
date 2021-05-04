import React from "react";

import { numberWithCommas } from "../../../../helpers/NumberHelper";
import FadeOutUp from "../fade-out-up";
import Styles from "./styles.module.scss";

const AcceptBet: React.FC<{ amount: number }> = ({ amount }) => (
    <FadeOutUp>
        <span className={Styles["accepted-bet"]}>{`-${numberWithCommas(amount)}`}</span>
    </FadeOutUp>
);

export default AcceptBet;
