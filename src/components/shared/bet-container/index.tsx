import React, { useEffect, useState } from "react";

import { ChipMapper } from "../../../common/constants";
import { useSystemContext } from "../../../contexts/system";
import { GameState } from "../game-base/type";
import OverlayMaskWhite from "../overlay-mask-white";
import { Props } from "./bet-container";
import Styles from "./bet-container.module.scss";

const BetContainer: React.FC<Props> = (props) => {
    const systemContext = useSystemContext();
    const { betValue } = systemContext;
    const [customStyle, setCustomStyle] = useState<object>();
    const [cursorImage, setCursorImage] = useState<string>("");

    useEffect(() => {
        setCursorImage(`"/static/images/small-chips/small_${ChipMapper[betValue]}.png?v=762021"`);
    }, [betValue]);

    useEffect(() => {
        if (props.gameState === GameState.InRound) {
            setCustomStyle({ cursor: `url(${cursorImage}), auto` });
        } else {
            setCustomStyle({ cursor: "not-allowed" });
        }
    }, [props.gameState, cursorImage]);

    return (
        <div className={Styles["bet-container"]} style={customStyle}>
            {props.children}
            {GameState.LockingBet === props.gameState && <OverlayMaskWhite />}
        </div>
    );
};

export default BetContainer;
