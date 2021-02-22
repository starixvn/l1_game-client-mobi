import React from "react";
import BetChoice from "../bet-choice/bet-choice";
import BetChoiceModel from "../../../common/models/BetChoiceModel";
import { Row } from "reactstrap";

type Props = {
  betChoices: Array<BetChoiceModel>;
};

const generateBetChoices = (betChoices: Array<BetChoiceModel>) => {
  const result = [];

  betChoices.forEach((betChoice, index) => {
    result.push(
      <BetChoice data={betChoice} key={`choice-${index}`}></BetChoice>
    );
  });

  return result;
};

export default function BetGroup(props: Props) {
  const { betChoices } = props;

  return <Row>{generateBetChoices(betChoices)}</Row>;
}
