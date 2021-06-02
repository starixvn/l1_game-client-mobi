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
            {Object.values(result).map((value, index) => (
                <div className={Styles["content__coins"]}>
                    <span className={`${Styles["currency-soft-3d"]} ${Styles["currency-soft-3d_state_right"]}`}>
                        <span className={Styles["currency-soft-3d__front_inside"]}></span>
                        <span className={Styles["currency-soft-3d__front"]}></span>
                        <span className={Styles["currency-soft-3d__back_inside"]}></span>
                        <span className={Styles["currency-soft-3d__back"]}></span>
                    </span>
                </div>
                // <div key={index} className={Styles[`result-sedie-dot${index + 1}`]}>
                //     <div className={`${value ? Styles["result-dot-red"] : Styles["result-dot-white"]}`}></div>
                // </div>
            ))}
        </div>
    );
};
