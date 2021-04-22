import React from "react";
import { Result } from "../dragon-tiger";
import Styles from "./dragon-tiger-animations.module.scss";

const Plate: React.FC = ({ children }) => (
    <div className="overlay-mask">
        <div className={Styles["result-sedie-fadeOutDelay"]}>
            <div className={`${Styles["result-sedie-container"]} ${Styles["result-fadeIn-animation"]}`}>
                <div className={Styles["result-sedie-set"]}>
                    <div className={Styles["result-sedie-plate"]}></div>
                    {children}
                    <div className={Styles["result-sedie-bowl"]}></div>
                </div>
            </div>
        </div>
    </div>
);

export const CardsAnimation = () => (
    <div className={Styles["shake-the-plate"]}>
        <Plate />
    </div>
);

type Props = {
    result: Result;
};

export const OpenThePlate: React.FC<Props> = ({ result }) => (
    <div className={Styles["open-the-plate"]}>
        <Plate>
            {Object.values(result).map((value, index) => (
                <div key={index} className={`${Styles[`result-sedie-dot${index + 1}`]} ${Styles["result-sedie-dot"]}`}>
                    <div className={`${value ? Styles["result-dot-red"] : Styles["result-dot-white"]}`}></div>
                </div>
            ))}
        </Plate>
    </div>
);
