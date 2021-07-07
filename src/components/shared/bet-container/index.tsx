import React, { useEffect, useState } from "react";

import { GameState } from "../game-base/type";
import LockingBet from "../locking-bet";
import { Props } from "./bet-container";
import { useSystemContext } from "../../../contexts/system";
import { ChipMapper } from "../../../common/constants";
import Styles from "./bet-container.module.scss";

const BetContainer: React.FC<Props> = (props) => {
    const systemContext = useSystemContext();
    const { betValue } = systemContext;
    const [cursorImage, setCursorImage] = useState<string>("");
    const [customStyle, setCustomStyle] = useState<object>();

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
            {GameState.LockingBet === props.gameState && <LockingBet />}
        </div>
    );
};

export default BetContainer;
