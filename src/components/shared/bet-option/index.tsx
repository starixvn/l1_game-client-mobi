import React, { useContext, useState } from "react";

import { useGameContext } from "../../../contexts/game-context/game-context";
import PlaceBetModal from "../place-bet-modal/place-bet-modal";
import Styles from "./bet-option.module.scss";

type Props = {
    choice: string;
    odd: number;
    children: React.ReactNode;
};

const BetOption: React.FunctionComponent<Props> = (props) => {
    const { choice, odd, children } = props;
    const { totalBets, ownBets, placeBet } = useGameContext();
    const [isOpenBetModal, setIsOpenBetModal] = useState<boolean>(false);

    function openPlaceBetModal() {
        setIsOpenBetModal(true);
    }

    const closePlaceBetModal = () => {
        setIsOpenBetModal(false);
    };

    return (
        <div className={Styles.container}>
            <div className={Styles["bet-option"]} onClick={openPlaceBetModal}>
                <div className={Styles.odd}>{`1:${odd}`}</div>
                <div className={Styles["total-bet"]}>{totalBets?.[choice]}</div>
                {children}
                <div className={Styles["own-bet"]}>{ownBets?.[choice]}</div>
            </div>
            {isOpenBetModal && (
                <PlaceBetModal
                    isOpen={isOpenBetModal}
                    onCloseModal={closePlaceBetModal}
                    onPlaceBet={placeBet}
                    betChoiceInfo={{
                        betChoice: choice,
                        gameName: "Se Die",
                        roundId: 0,
                    }}
                ></PlaceBetModal>
            )}
        </div>
    );
};

export default BetOption;
