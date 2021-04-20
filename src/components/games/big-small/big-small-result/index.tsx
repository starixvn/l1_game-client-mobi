import React, { useEffect, useState } from "react";

import BalancedBettingPool from "../../../shared/balanced-betting-pool";
import Styles from "./big-small-result.module.scss";
import { Props } from "./type";

const balancedBettingTimeInSecond = 3;

const BigSmallResult: React.FC<Props> = (props) => {
    const [isDisplayResult, setIsDisplayResult] = useState(false);
    const result: number[] = props.result ? Object.values(props.result) : [];
    const generateResult = (result: number[]) => {
        return result.map((value, index) => (
            <div key={index} className={Styles[`result-${index + 1}`]}>
                <img src={`/static/images/bigsmall-dice-${value}.png`} className={Styles["dice"]} alt="dice" />
            </div>
        ));
    };

    useEffect(() => {
        const timer = setTimeout(() => setIsDisplayResult(true), balancedBettingTimeInSecond * 1000);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    if (isDisplayResult) {
        return (
            <div className={`${Styles["container"]} ${Styles["show-result"]}`}>
                <div className="overlay-mask">
                    <div className={`${Styles["animation-container"]} ${Styles["result-fadeIn-animation"]}`}>
                        <div className={Styles["result-plate"]}></div>
                        <div className={Styles["toss-dices"]}>
                            <img src="/static/images/bigsmall_dice.gif" alt="shake" />
                        </div>
                        <div className={Styles["result-container"]}>{generateResult(result)}</div>
                    </div>
                </div>
            </div>
        );
    } else {
        return <BalancedBettingPool />;
    }
};

export default BigSmallResult;
