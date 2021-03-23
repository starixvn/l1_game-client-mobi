import React, { useState } from "react";

import PlaceBetModal from "../place-bet-modal/place-bet-modal";
import Styles from "./bet-option.module.scss";

type Props = {
    choice: string;
    odd: number;
    children: React.ReactNode;
};

const BetOption: React.FunctionComponent<Props> = (props) => {
    const [isShowBetModal, updateState] = useState<boolean>(false);
    const { choice, odd, children } = props;
    return (
        <div className={Styles["bet-option"]} onClick={() => updateState(true)}>
            <div className={Styles.odd}>{odd}</div>
            {children}
            <PlaceBetModal
                isShow={isShowBetModal}
                handleModalStatus={(isShow: boolean) => updateState(isShow)}
                onPlaceBet={() => {}}
                betChoiceInfo={{
                    betChoice: choice,
                    gameName: "Se Die",
                    roundId: 0,
                }}
            ></PlaceBetModal>
        </div>
    );
};

export default BetOption;
