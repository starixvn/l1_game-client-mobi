import React from "react";
import { Result } from "../sedie";
import Styles from "./sedie-animations.module.scss";

const Plate: React.FC = ({ children }) => (
    <div className="overlay-mask">
        <div className={Styles["animation-container"]}>
            <div className={Styles["result-sedie-set"]}>
                <div className={Styles["result-sedie-plate"]}></div>
                {children}
                <div className={Styles["result-sedie-bowl"]}></div>
            </div>
        </div>
    </div>
);

export const ShakeThePlate = () => (
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
                <div key={index} className={Styles[`result-sedie-dot${index + 1}`]}>
                    <div className={`${value ? Styles["result-dot-red"] : Styles["result-dot-white"]}`}></div>
                </div>
            ))}
        </Plate>
    </div>
);
