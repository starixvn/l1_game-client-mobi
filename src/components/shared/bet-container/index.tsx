import React, { useState } from "react";
import { GameState } from "../game-base/type";
import PlaceBetModal from "../place-bet-modal/place-bet-modal";
import { BetModalInfo, Props } from "./bet-container";
import { BetContextProvider } from "../../../contexts/bet-context";
import { BetContextModel } from "../../../contexts/bet-context/type";
import { useGameContext } from "../../../contexts/game-context/game-context";

import Styles from "./bet-container.module.scss";

const BetContainer: React.FC<Props> = (props) => {
    const [isOpenModal, updateModalState] = useState<boolean>(false);
    const [betInfo, updateBetInfo] = useState<BetModalInfo>(null);
    const { placeBet } = useGameContext();

    const betContext: BetContextModel = {
        updateBetModalInfo: updateBetInfo,
        handleShowBetModal: updateModalState,
    };

    return (
        <BetContextProvider value={betContext}>
            <div className={Styles["bet-container"]}>
                {props.children}
                {GameState.LockingBet === props.gameState && <div className={Styles["overlay-mask"]}></div>}
                {isOpenModal && (
                    <PlaceBetModal
                        isOpen={isOpenModal}
                        onCloseModal={() => updateModalState(false)}
                        onPlaceBet={placeBet}
                        betChoiceInfo={{
                            betChoice: betInfo.choice,
                            gameName: betInfo.gameName,
                            roundId: betInfo.roundId,
                        }}
                    ></PlaceBetModal>
                )}
            </div>
        </BetContextProvider>
    );
};

export default BetContainer;
