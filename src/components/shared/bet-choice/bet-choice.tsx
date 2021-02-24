import React, { useState } from "react";
import Styles from "./bet-choice.module.scss";
import BetChoiceModel from "../../../common/models/BetChoiceModel";
import PlaceBetModal from "../place-bet-modal/place-bet-modal";
import { Col } from "reactstrap";

export default function BetChoice(props: { data: BetChoiceModel }) {
  const [isShowBetModal, updateState] = useState<boolean>(false);

  return (
    <Col
      xs={12 / props.data.size}
      className={`${Styles.container} 
      ${props.data.isHighlight ? Styles.highlight : ""}`}
      onClick={() => updateState(true)}
    >
      <div className={Styles.odds}>{props.data.odds}</div>
      <div className={Styles.betChoice}>{props.data.name}</div>
      <PlaceBetModal
        isShow={isShowBetModal}
        handleModalStatus={(isShow) => updateState(isShow)}
        onPlaceBet={() => {}}
        betChoiceInfo={{
          betChoice: props.data.name,
          gameName: "Se Die",
          roundId: props.data.size,
        }}
      ></PlaceBetModal>
    </Col>
  );
}
