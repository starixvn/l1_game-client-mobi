import classes from "*.module.css";
import React, { useState } from "react";
import { WithStylesProps } from "react-jss";

import PlaceBetModal from "../place-bet-modal/place-bet-modal";
import Styles from "./bet-option.module.scss";

type Props = {
    choice: string;
    odd: number;
} & WithStylesProps<{}>;

const BetOption: React.FunctionComponent<Props> = (props) => {
    const [isShowBetModal, updateState] = useState<boolean>(false);
    const { choice, odd } = props;
    return (
        <div className={Styles.container} onClick={() => updateState(true)}>
            <div className={Styles.odd}>{odd}</div>
            <div className={classes.choice}></div>
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
