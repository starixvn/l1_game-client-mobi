import React from "react";
import { useGameContext } from "../../../../contexts/game-context/game-context";
import { Result } from "../sedie";
import Styles from "./sedie-animations.module.scss";

const Plate: React.FC = ({ children }) => {
    const { isCompactMode } = useGameContext();

    return (
        <div className="overlay-mask-no-bg">
            <div className={`${Styles["animation-container"]} ${isCompactMode ? Styles["compact-mode"] : ""}`}>
                <div className={Styles["result-sedie-set"]}>
                    <div className={Styles["result-sedie-plate"]}></div>
                    {children}
                    <div className={Styles["result-sedie-bowl"]}></div>
                </div>
            </div>
        </div>
    );
};

export const ShakeThePlate = () => (
    <div className={Styles["shake-the-plate"]}>
        <Plate />
    </div>
);

type Props = {
    result: Result;
};

export const OpenThePlate: React.FC<Props> = ({ result }) => (
    <div className={`${Styles["open-the-plate"]} ${Styles["has-animation"]}`}>
        <Plate>
            <div className={Styles["result-container"]}>
                {Object.values(result).map((value, index) => (
                    <div key={index} className={Styles[`result-sedie-dot${index + 1}`]}>
                        <div className={`${value ? Styles["result-dot-red"] : Styles["result-dot-white"]}`}></div>
                    </div>
                ))}
            </div>
        </Plate>
    </div>
);
