import React, { useState } from "react";

import { useSocketContext } from "../../contexts/socket";
import PlaceBetModal from "../place-bet-modal/place-bet-modal";
import Styles from "./bet-option.module.scss";

type Props = {
    choice: string;
    odd: number;
    children: React.ReactNode;
};

const BetOption: React.FunctionComponent<Props> = (props) => {
    const [isOpenBetModal, setIsOpenBetModal] = useState<boolean>(false);
    const { choice, odd, children } = props;
    const socket = useSocketContext();

    function openPlaceBetModal() {
        setIsOpenBetModal(true);
    }

    const closePlaceBetModal = () => {
        setIsOpenBetModal(false);
    };

    const placeBet = (betChoice: string, amount: number) => {
        socket.emit("bet", { betChoice, amount });
    };

    return (
        <div className={Styles.container}>
            <div className={Styles["bet-option"]} onClick={openPlaceBetModal}>
                <div className={Styles.odd}>{odd}</div>
                {children}
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
