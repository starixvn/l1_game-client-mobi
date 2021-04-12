import React, { useState } from "react";

import { BetContextProvider } from "../../../contexts/bet-context";
import { BetContextModel } from "../../../contexts/bet-context/type";
import { useGameActionContext } from "../../../contexts/game-actions-context";
import { useGameContext } from "../../../contexts/game-context/game-context";
import { GameState } from "../game-base/type";
import PlaceBetModal from "../place-bet-modal/place-bet-modal";
import { Props } from "./bet-container";
import Styles from "./bet-container.module.scss";

const BetContainer: React.FC<Props> = (props) => {
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [betChoice, setBetChoice] = useState<string>(null);
    const [odd, setOdd] = useState<number>(0);
    const { roundId, gameSetting } = useGameContext();
    const { gameName } = gameSetting;
    const { placeBet } = useGameActionContext();

    const betContext: BetContextModel = {
        handleShowBetModal: openBetModal,
    };

    function openBetModal(choice: string, odd: number) {
        setBetChoice(choice);
        setOdd(odd);
        setIsOpenModal(true);
    }

    return (
        <BetContextProvider value={betContext}>
            <div className={Styles["bet-container"]}>
                {props.children}
                {GameState.LockingBet === props.gameState && <div className={Styles["overlay-mask"]}></div>}
                {isOpenModal && (
                    <PlaceBetModal
                        isOpen={isOpenModal}
                        onCloseModal={() => setIsOpenModal(false)}
                        onPlaceBet={placeBet}
                        betChoiceInfo={{
                            betChoice,
                            gameName,
                            roundId,
                            odd,
                        }}
                    ></PlaceBetModal>
                )}
            </div>
        </BetContextProvider>
    );
};

export default BetContainer;
