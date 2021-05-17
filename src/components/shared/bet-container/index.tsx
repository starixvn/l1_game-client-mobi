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

    useEffect(() => {
        setCursorImage(`"/static/images/small_${ChipMapper[betValue]}.png"`);
    }, [betValue]);
    return (
        <div className={Styles["bet-container"]} style={{ cursor: `url(${cursorImage}), auto` }}>
            {props.children}
            {GameState.LockingBet === props.gameState && <LockingBet />}
        </div>
    );
};

export default BetContainer;
