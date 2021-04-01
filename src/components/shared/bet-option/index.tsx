import React from "react";
import { useBetContext } from "../../../contexts/bet-context";

import { useGameContext } from "../../../contexts/game-context/game-context";
import Styles from "./bet-option.module.scss";

type Props = {
    choice: string;
    children: React.ReactNode;
    isHighlight: boolean;
};

const BetOption: React.FunctionComponent<Props> = (props) => {
    const { choice, children, isHighlight } = props;
    const { totalBets, ownBets, gameConfigs } = useGameContext();
    const { handleShowBetModal, updateBetChoice } = useBetContext();
    const odds = gameConfigs.odds;

    function openPlaceBetModal() {
        updateBetChoice(props.choice);
        handleShowBetModal(true);
    }

    return (
        <div className={Styles.container}>
            <div className={`${Styles["bet-option"]} ${isHighlight ? "hightlight-winning" : ""}`} onClick={openPlaceBetModal}>
                <div className={Styles.odd}>{`1:${odds[choice]}`}</div>
                <div className={Styles["total-bet"]}>{totalBets?.[choice]}</div>
                {children}
                <div className={Styles["own-bet"]}>{ownBets?.[choice]}</div>
            </div>
        </div>
    );
};

export default BetOption;
