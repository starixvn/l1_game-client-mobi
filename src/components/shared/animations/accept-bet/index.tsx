import React, { useEffect, useRef, useState } from "react";

import { numberWithCommas } from "../../../../helpers/number-helper";
import { BetPosition } from "../../game-base/type";
import Styles from "./styles.module.scss";

const AcceptBet: React.FC<{ betInfo: { amount: number; betPosition?: BetPosition } }> = ({ betInfo }) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [customStyle, setCustomStyle] = useState<React.CSSProperties>({ position: "fixed", right: "auto" });

    useEffect(() => {
        if (wrapperRef.current) {
            const windowWidth = window.innerWidth;
            const wrapperWidth = wrapperRef.current.getBoundingClientRect().width;
            const newCustomStyle = { ...customStyle };

            newCustomStyle.top = betInfo.betPosition?.y - 30;
            newCustomStyle.left = Math.min(windowWidth - wrapperWidth - 10, betInfo.betPosition?.x - 15);
            newCustomStyle.left = Math.max(10, newCustomStyle.left);

            setCustomStyle(newCustomStyle);
        }
    }, [wrapperRef]);

    return (
        <div
            ref={wrapperRef}
            style={betInfo.betPosition ? customStyle : null}
            className={`${Styles["accepted-bet"]}`}
        >{`-${numberWithCommas(betInfo.amount)}`}</div>
    );
};

export default AcceptBet;
