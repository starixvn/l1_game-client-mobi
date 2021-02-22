import { SignKeyObjectInput } from "crypto";

export default class BetChoiceModel {
  odds: number;
  name: string;
  size: number;
  isHighlight: boolean;

  constructor(
    name: string = "",
    odds: number = -1,
    size: number = 1,
    isHighlight: boolean = false
  ) {
    this.odds = odds;
    this.name = name;
    this.size = size;
    this.isHighlight = isHighlight;
  }
}
