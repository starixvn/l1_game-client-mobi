import React from "react";

import { numberWithCommas } from "../../../../helpers/number-helper";
import Styles from "./styles.module.scss";

const WinningBet: React.FC<{ amount: number }> = ({ amount }) => {
    return (
        <div className={Styles["winning-bet"]}>
            <div className={Styles["group-light"]}>
                <img className={Styles["light"]} src={`/static/images/winning-bet-light.png`} alt="light" />
                <img className={`${Styles["light"]} ${Styles["light-2"]}`} src={`/static/images/winning-bet-light.png`} alt="light" />
            </div>
            <span className={Styles["number"]}>{`+${numberWithCommas(amount)}`}</span>
        </div>
    );
};

export default WinningBet;
