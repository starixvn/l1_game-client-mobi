import Link from "next/link";
import TopInfo from "../../shared/top-info";
import RoundResult from "../../shared/round-result";
import Ball from "../../shared/ball";
import PercentageCircle from "../../shared/percentage-circle";
import Style from "./next-ball.module.scss";
import { RoundResultData } from "../../../common/constants";

interface BetOptionData {
  betChoice: string;
  odds: number;
  totalStakes: number;
  players: number;
  percent: number;
  bgColor: string;
  isRight?: boolean;
}

const betData: BetOptionData[] = [
  {
    betChoice: "Over",
    odds: 1.97,
    totalStakes: 100000,
    players: 17,
    percent: 55,
    bgColor: "blue",
  },
  {
    betChoice: "Under",
    odds: 1.97,
    totalStakes: 100000,
    players: 17,
    percent: 55,
    bgColor: "blue",
    isRight: true,
  },
  {
    betChoice: "Odd",
    odds: 1.97,
    totalStakes: 100000,
    players: 17,
    percent: 55,
    bgColor: "red",
  },
  {
    betChoice: "Even",
    odds: 1.97,
    totalStakes: 100000,
    players: 17,
    percent: 55,
    bgColor: "red",
    isRight: true,
  },
];

const resultData: RoundResultData[] = [
  {
    betChoiceShort: "O",
    color: "blue",
    count: 37,
  },
  {
    betChoiceShort: "U",
    color: "blue",
    count: 15,
  },
  {
    betChoiceShort: "O",
    color: "red",
    count: 25,
  },
  {
    betChoiceShort: "E",
    color: "red",
    count: 23,
  },
];

export default function NextBall() {
  return (
    <>
      <div className="breadcrumb flex items-center">
        <Link href={"/"}>
          <span className="icon-back back-to-home"></span>
        </Link>

        <div className="flex items-center text-white game-name">Next Ball</div>
      </div>

      <TopInfo />
      <div className="relative pt-4">
        <div className="flex justify-center">
          <img src="/images/next-ball/lottery.png" alt="arrow-bg" />
        </div>

        <div className="mx-auto pt-3 flex gap-2 justify-center">
          <Ball number={38} color="red" />
          <Ball number={27} color="blue" />
          <Ball number={64} color="blue" />
          <Ball number={1} color="red" />
          <Ball isLoading />
          <Ball isEmpty />
          <Ball isEmpty />
          <Ball isEmpty />
        </div>
      </div>
      <div className={`${Style["bet-choice-container"]} px-3`}>
        {betData.map((items) => (
          <div
            className={`${Style["bet-choice"]}  ${Style[items.bgColor]} ${items.isRight ? Style["right"] : ""
              }`}
            key={items.betChoice}
          >
            <div className={`flex justify-between ${Style["bet-choice-info"]}`}>
              <div className={Style.percent}>
                <PercentageCircle percentage={items.percent} />
              </div>
              <div className={Style.stake}>
                <div
                  className={`flex items-center ${Style["total-stakes"]} gap-1`}
                >
                  <span className="icon-coin"></span>
                  <span>{items.totalStakes}</span>
                </div>
                <div className={`flex items-center  ${Style["players"]} gap-1`}>
                  <span className="icon-user"></span>
                  <span>{items.players}</span>
                </div>
              </div>
            </div>
            <div className="bet-name text-center mt-[-5px]">
              {items.betChoice}
            </div>
            <div className="bet-odds text-center">{items.odds}</div>
            <div className="own-bet">
              <span className="bet-value">100</span>
            </div>
          </div>
        ))}
      </div>
      <RoundResult roundId={134} resultData={resultData} />
    </>
  );
}
