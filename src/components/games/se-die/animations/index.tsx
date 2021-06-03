import React from "react";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import { ModeView } from "../../../shared/game-base/type";
import { Result } from "../sedie";
import Styles from "./sedie-animations.module.scss";

const Plate: React.FC = ({ children }) => {
    const { modeView } = useGameContext();

    return (
        <div className="overlay-mask-no-bg">
            <div className={`${Styles["animation-container"]} ${modeView === ModeView.compact ? Styles["compact-mode"] : ""}`}>
                <div className={Styles["result-sedie-set"]}>
                    <div className={Styles["result-sedie-plate"]}></div>
                    {children}
                    <div className={Styles["result-sedie-bowl"]}></div>
                </div>
            </div>
        </div>
    );
};

export const ShakeThePlate: React.FC<{ playAnimation?: boolean }> = ({ playAnimation = false }) => (
    <div className={playAnimation ? Styles["shake-the-plate"] : ""}>
        <Plate />
    </div>
);

export const OpenThePlate: React.FC<{ result: Result }> = ({ result }) => {
    const { playResultAnimation } = useGameContext();
    return (
        <div className={`${Styles["open-the-plate"]} ${playResultAnimation ? Styles["has-animation"] : ""}`}>
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
};

export const SeDieResultCollapse: React.FC<{ result: Result }> = ({ result }) => {
    const { playResultAnimation } = useGameContext();
    return (
        <div className={`${Styles["result-collapse-mode"]} ${playResultAnimation ? Styles["has-animation"] : ""}`}>
            {Object.values(result).map((value, index) => {
                const resultClass = `dot-3d-${index + 1}`;
                return (
                    <div className={Styles["result-item"]} key={resultClass}>
                        <div
                            key={"rotate" + index}
                            className={`${Styles[resultClass]} ${index % 2 ? Styles["option1"] : Styles["option2"]}`}
                        >
                            <span className={Styles["dot-3d-front-inside"]}></span>
                            <span className={Styles["dot-3d-front"]}></span>
                            <span className={Styles["dot-3d-back_inside"]}></span>
                            <span className={Styles["dot-3d-back"]}></span>
                        </div>
                        <div key={index} className={Styles[`result-sedie-dot${index + 1}`]}>
                            <div className={`${value ? Styles["result-dot-red"] : Styles["result-dot-white"]}`}></div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
