import React, { useEffect } from "react";

import { numberWithCommas } from "../../../../helpers/number-helper";
import Styles from "./styles.module.scss";

const WinningBet: React.FC<{ amount: number; handleUpdateUserBalance: Function }> = ({ amount, handleUpdateUserBalance }) => {
    useEffect(() => {
        handleUpdateUserBalance();
    }, []);
    debugger;
    return (
        <div className={Styles["winning-bet"]}>
            <span className={Styles["number"]}>{`+${numberWithCommas(amount)}`}</span>
        </div>
    );
};

export default WinningBet;
