import React from "react";
import { Result, SettlementResult } from "../dragon-tiger";
import Styles from "./dragon-tiger-animations.module.scss";

export const CardsAnimation = () => (
    <div className={Styles["draw-cards"]}>
        <div className={`${Styles["animation-container"]}`}>
            <div className={Styles["card1"]}>
                <div className={Styles["card-shadow"]}></div>
                <div className={Styles["card-bg"]}></div>
            </div>
            <div className={Styles["card2"]}>
                <div className={Styles["card-shadow"]}></div>
                <div className={Styles["card-bg"]}></div>
            </div>
        </div>
    </div>
);

type Props = {
    result?: Result;
    settlementResult?: SettlementResult;
};

export const DragonTigerResult: React.FC<Props> = (props) => {
    const result = props.result ? Object.values(props.result) : [];

    const generateResult = (result: boolean[]) => {
        return result.map((value, index) => <div></div>);
    };

    return (
        <div className={Styles["open-cards"]}>
            <div className="overlay-mask">
                <div className={`${Styles["animation-container"]}`}>
                    <div className={Styles["card1"]}>
                        <div className={Styles["card-shadow"]}></div>
                        <div className={Styles["card-bg"]}>
                            <div className={Styles["result"]}>
                                <div className={Styles["card-group-left"]}>
                                    <div className={`${Styles["text-red"]} ${Styles["card-number"]}`}>2</div>
                                    <div className={`${Styles["card-heart-small"]} ${Styles["card-suite-small"]}`}></div>
                                </div>
                                <div className={Styles["card-group-right"]}>
                                    <div className={`${Styles["card-heart"]} ${Styles["card-suite-large"]}`}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={Styles["card2"]}>
                        <div className={Styles["card-shadow"]}></div>
                        <div className={Styles["card-bg"]}>
                            <div className={Styles["result"]}>
                                <div className={Styles["card-group-left"]}>
                                    <div className={`${Styles["text-black"]} ${Styles["card-number"]}`}>A</div>
                                    <div className={`${Styles["card-club-small"]} ${Styles["card-suite-small"]}`}></div>
                                </div>
                                <div className={Styles["card-group-right"]}>
                                    <div className={`${Styles["card-k-picture"]} ${Styles["card-picture"]}`}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={Styles["result-highlight"]}>Tiger Win</div>
                </div>
            </div>
        </div>
    );
};
