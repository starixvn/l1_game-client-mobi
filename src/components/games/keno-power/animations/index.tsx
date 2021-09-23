import { useTranslation } from "next-i18next";
import React from "react";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import { Result, SettlementResult } from "../keno-power";
import { GetChoiceTranslate } from "../keno-power-helper";
import Styles from "./keno-power-animations.module.scss";

const elements = ["gold", "wood", "water", "fire", "earth"];
export const getSettleResult = (result: Result, settlementResult: SettlementResult) => {
    let shuffle = [];
    for (var i = 1; i <= 20; i++) {
        shuffle.push(i);
    }

    shuffle = shuffle.sort((a, b) => 0.5 - Math.random());
    const total = result.reduce((a, b) => a + b, 0);

    return {
        total,
        shuffle,
        big: settlementResult?.big,
        even: settlementResult?.even,
        element: elements.filter((e) => settlementResult[e])[0],
    };
};
export const generateResult = (result: Result, shuffle: number[], isAnimation = true) => {
    const rows = [];
    const maxNumInRow = 5;
    const noRows = 20 / maxNumInRow;
    for (let i = 0; i < noRows; i++) {
        rows.push([]);
    }

    rows.forEach((row, index) => {
        for (let i = 0; i < maxNumInRow; i++) {
            row.push(result[i + index * maxNumInRow]);
        }
    });

    return rows.map((row, ri) => {
        return row.map((num, ni) => {
            const index = ri * maxNumInRow + ni;
            const classAnimateNumber = `animate-${shuffle[index]}`;
            return (
                <div key={index} className={`${Styles["number-animate"]} ${isAnimation && Styles[classAnimateNumber]}`}>
                    <div className={`${Styles["number"]}`}>{num}</div>
                    <div className={`${Styles["number-cover"]}`}></div>
                </div>
            );
        });
    });
};

class AnimationComponent extends React.PureComponent<
    {
        result?: Result;
        big?: boolean;
        even?: boolean;
        element?: string;
        playResultAnimation?: boolean;
        shuffle: number[];
        settleTotal: number;
        texts: any;
    },
    {
        result?: Result;
        big?: boolean;
        even?: boolean;
        element?: string;
        playResultAnimation?: boolean;
        shuffle: number[];
        settleTotal: number;
        texts: any;
        currentTotal: number;
        currentIndex: number;
    }
> {
    private animationInterval: NodeJS.Timer;
    constructor(props) {
        super(props);
        this.state = {
            currentTotal: props.playResultAnimation ? 0 : props.settleTotal,
            currentIndex: 0,
            ...props,
        };
    }

    componentDidMount() {
        if (this.state.playResultAnimation) {
            const elem = this;

            this.animationInterval = setInterval(() => {
                if (elem.state.currentIndex === elem.state.result.length) {
                    clearInterval(this.animationInterval);
                    return;
                }

                const numberIndex = elem.state.shuffle[elem.state.currentIndex] - 1;
                elem.setState({
                    currentTotal: elem.state.currentTotal + elem.state.result[numberIndex],
                    currentIndex: elem.state.currentIndex + 1,
                });
            }, 100);
        } else if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.setState({
                currentTotal: this.state.settleTotal,
                currentIndex: 0,
            });
        }
    }

    componentWillUnmount() {
        this.animationInterval && clearInterval(this.animationInterval);
    }

    render() {
        return (
            <div className={`${Styles["animation-container"]}`}>
                <div className={Styles["result"]}>
                    <div className={Styles["number-container"]}>{generateResult(this.state.result, this.state.shuffle)}</div>

                    <div className={Styles["result-total"]}>
                        <div className={Styles["result-total-lbl"]}>{this.state.texts.total} </div>
                        <div className={Styles["result-total-number"]}>{this.state.currentTotal}</div>
                    </div>
                </div>
                <div className={Styles["settle-info"]}>
                    <div className={Styles[`result-info-${this.state.big ? "blue" : "red"}`]}>{this.state.texts.big}</div>
                    <div className={Styles[`result-info-${this.state.even ? "blue" : "red"}`]}>{this.state.texts.even}</div>
                    <div className={Styles["result-info-grey"]}>{this.state.texts.element}</div>
                </div>
            </div>
        );
    }
}

export const KenoPowerResult: React.FC<{ result?: Result; settlementResult: SettlementResult }> = ({ result, settlementResult }) => {
    const { playResultAnimation, gameSetting } = useGameContext();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());
    const settleResult = getSettleResult(result, settlementResult);
    const texts = GetChoiceTranslate(t, settleResult);

    return (
        <div className={`${playResultAnimation ? Styles["has-animation"] : ""}`}>
            <div className="overlay-mask">
                <AnimationComponent
                    big={settlementResult.big}
                    even={settlementResult.even}
                    element={settleResult.element}
                    playResultAnimation={playResultAnimation}
                    result={result}
                    shuffle={settleResult.shuffle}
                    settleTotal={settleResult.total}
                    texts={texts}
                />
            </div>
        </div>
    );
};

export const KenoPowerResultCollapse: React.FC<{ result: Result; settlementResult: SettlementResult }> = ({ result, settlementResult }) => {
    const { playResultAnimation, gameSetting } = useGameContext();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());
    const settleResult = getSettleResult(result, settlementResult);

    return (
        <div className={`${Styles["result-collapse-mode"]}  ${playResultAnimation ? Styles["has-animation"] : ""}`}>
            <div className={Styles["result-container-collapse"]}>{generateResult(result, settleResult.shuffle)}</div>
            {!playResultAnimation && settlementResult && (
                <div className={Styles["result-label"]}>
                    <span className={Styles["total-point"]}>{settleResult.total}</span>-{` ${t(settleResult.big ? "big" : "small")}`}
                </div>
            )}
        </div>
    );
};
