import React from "react";
import Styles from "./bet-choice.module.scss";
import BetChoiceModel from "../../../common/models/BetChoiceModel";
import { Col } from "reactstrap";

export default function BetChoice(props: { data: BetChoiceModel }) {
  return (
    <Col
      xs={12 / props.data.size}
      className={`${Styles.container} 
      ${props.data.isHighlight ? Styles.highlight : ""}`}
    >
      <div className={Styles.odds}>{props.data.odds}</div>
      <div className={Styles.betChoice}>{props.data.name}</div>
    </Col>
  );
}
