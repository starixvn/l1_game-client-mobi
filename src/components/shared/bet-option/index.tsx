import React from "react";
import { useBetContext } from "../../../contexts/bet-context";

import { useGameContext } from "../../../contexts/game-context/game-context";
import Styles from "./bet-option.module.scss";

type Props = {
    choice: string;
    odd: number;
    children: React.ReactNode;
};

const BetOption: React.FunctionComponent<Props> = (props) => {
    const { choice, odd, children } = props;
    const { totalBets, ownBets } = useGameContext();
    const { handleShowBetModal, updateBetChoice } = useBetContext();

    function openPlaceBetModal() {
        updateBetChoice(props.choice);
        handleShowBetModal(true);
    }

    return (
        <div className={Styles.container}>
            <div className={Styles["bet-option"]} onClick={openPlaceBetModal}>
                <div className={Styles.odd}>{`1:${odd}`}</div>
                <div className={Styles["total-bet"]}>{totalBets?.[choice]}</div>
                {children}
                <div className={Styles["own-bet"]}>{ownBets?.[choice]}</div>
            </div>
        </div>
    );
};

export default BetOption;
