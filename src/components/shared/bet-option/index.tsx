import React from "react";

import { useBetContext } from "../../../contexts/bet-context";
import { useGameContext } from "../../../contexts/game-context/game-context";
import Styles from "./bet-option.module.scss";

type Props = {
    choice: string;
    odd: number;
    children: React.ReactNode;
    isHighlight: boolean;
    isDisplayOdd?: boolean;
};

const BetOption: React.FunctionComponent<Props> = ({ choice, odd, children, isHighlight = false, isDisplayOdd = true }) => {
    const { totalBets, ownBets } = useGameContext();
    const { handleShowBetModal } = useBetContext();

    function openPlaceBetModal() {
        handleShowBetModal(choice, odd);
    }

    return (
        <div className={Styles.container}>
            <div className={`${Styles["bet-option"]} ${isHighlight ? Styles["hightlight-winning"] : ""}`} onClick={openPlaceBetModal}>
                {isDisplayOdd && <div className={Styles.odd}>{`1:${odd}`}</div>}
                <div className={Styles["total-bet"]}>{totalBets?.[choice]}</div>
                {children}
                <div className={Styles["own-bet"]}>{ownBets?.[choice]}</div>
            </div>
        </div>
    );
};

export default BetOption;
