import React from "react";
import BetGroup from "../bet-group/bet-group";
import BetChoiceModel from "../../../common/models/BetChoiceModel";

export default function BetTable() {
  const fakeData = [
    new BetChoiceModel("Odd", 1.96, 2),
    new BetChoiceModel("Even", 1.96, 2),
    new BetChoiceModel("3 Red", 3, 3),
    new BetChoiceModel("Draw", 3, 3),
    new BetChoiceModel("3 White", 3, 3, true),
  ];

  return (
    <div>
      <BetGroup betChoices={fakeData}></BetGroup>
    </div>
  );
}
