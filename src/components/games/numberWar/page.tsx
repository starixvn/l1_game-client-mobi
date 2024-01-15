"use client";
import Link from "next/link";
import TopInfo from "../../shared/top-info";
import RoundResult from "../../shared/round-result";
import PercentageCircle from "../../shared/percentage-circle";
import Style from "./number-war.module.scss";
import Ball from "../../shared/ball";
import Scoreboard from "../../shared/scoreboard";
import { BetOptionData, RoundResultData } from "../../../common/constants";
import AnimatedBingo from "../../shared/animated-bingo";
import BallSVG from "./ballSVG";

const betData: BetOptionData[] = [
  {
    betChoice: "Player",
    odds: 1.97,
    totalStakes: 1382.76,
    players: 37,
    percent: 55,
  },
  {
    betChoice: "Banker",
    odds: 1.97,
    totalStakes: 1444,
    players: 15,
    percent: 35,
  },
  {
    betChoice: "Tie",
    odds: 1.97,
    totalStakes: 357.44,
    players: 7,
    percent: 10,
  },
];

const resultData: RoundResultData[] = [
  {
    betChoiceShort: "P",
    color: "blue",
    count: 37,
  },
  {
    betChoiceShort: "B",
    color: "red",
    count: 15,
  },
  {
    betChoiceShort: "T",
    color: "green",
    count: 7,
  },
];

export default function NumberWar() {
  const dataPlayer = betData[0];
  const dataBanker = betData[1];
  const dataTie = betData[2];

  const onClickPlayer = () => {
    console.log("onClickPlayer");
  };

  const onClickBanker = () => {
    console.log("onClickBanker");
  };
  const onClickTie = () => {
    console.log("onClickTie");
  };

  return (
    <>
      <div className="breadcrumb flex items-center">
        <Link href={"/"}>
          <span className="icon-back back-to-home"></span>
        </Link>

        <div className="flex items-center text-white game-name">Number War</div>
      </div>

      <TopInfo />

      <div className="result-container flex justify-center gap-4 mt-6">
        <div className="player-container flex gap-4">
          <div className={Style["lottery-player-container"]}>
            <img
              src="/images/bac-number/lottery-player.png"
              alt="lottery-player"
            />
            {/* <div>
              <BallSVG className={Style["ball-svg"]} />
            </div> */}
          </div>
          <div className="mx-auto pt-3 flex gap-3 justify-center flex-col">
            <Ball number={38} color="red" />
            <Ball number={27} color="blue" />
            <Ball isLoading />
            <Ball isEmpty />
          </div>
        </div>
        <div className="player-container flex gap-4">
          <div className="mx-auto pt-3 flex gap-3 justify-center flex-col">
            <Ball number={48} color="blue" />
            <Ball number={3} color="blue" />
            <Ball isLoading />
            <Ball isEmpty />
          </div>
          <div className="lottery">
            <img
              src="/images/bac-number/lottery-banker.png"
              alt="lottery-player"
            />
          </div>
        </div>
      </div>
      {/* <AnimatedBingo /> */}

      <div className={`${Style["betting-zone"]} mt-6`}>
        <div className={Style["left-corner"]}></div>
        <div className={Style["right-corner"]}></div>
        <div
          className={`${Style["player"]} text-white relative`}
          onClick={onClickPlayer}
        >
          <div className={`flex justify-between pt-5`}>
            <div className={Style.stake}>
              <div
                className={`flex items-center ${Style["total-stakes"]} gap-1`}
              >
                <span className="icon-coin"></span>
                <span>{dataPlayer.totalStakes}</span>
              </div>
              <div className="flex items-center players gap-1">
                <span className="icon-user"></span>
                <span>{dataPlayer.players}</span>
              </div>
            </div>
            <div className={Style.percent}>
              <PercentageCircle percentage={dataPlayer.percent} />
            </div>
          </div>
          <div className="bet-name text-center mt-8">
            {dataPlayer.betChoice}
          </div>
          <div className="bet-odds text-center">{dataPlayer.odds}</div>
          <div className={`own-bet ${Style["own-bet"]}`}>
            <span className="bet-value">10</span>
          </div>
        </div>

        <div
          className={`${Style["banker"]} text-white relative`}
          onClick={onClickBanker}
        >
          <div className={`flex pt-5 justify-between`}>
            <div className={Style.percent}>
              <PercentageCircle percentage={dataBanker.percent} />
            </div>
            <div className={Style.stake}>
              <div
                className={`flex items-center ${Style["total-stakes"]} gap-1`}
              >
                <span className="icon-coin"></span>
                <span>{dataBanker.totalStakes}</span>
              </div>
              <div className="flex items-center players gap-1 justify-end">
                <span className="icon-user"></span>
                <span>{dataBanker.players}</span>
              </div>
            </div>
          </div>
          <div className="bet-name text-center mt-8">
            {dataBanker.betChoice}
          </div>
          <div className="bet-odds text-center">{dataBanker.odds}</div>
          <div className={`own-bet ${Style["own-bet"]}`}>
            <span className="bet-value">10</span>
          </div>
        </div>

        <div
          className={`${Style["tie"]} text-white flex flex-col items-center pt-2 relative`}
          onClick={onClickTie}
        >
          <div className={Style.percent}>
            <PercentageCircle percentage={dataTie.percent} />
          </div>
          <div className={Style.stake}>
            <div
              className={`flex items-center ${Style["total-stakes"]} gap-1 justify-center`}
            >
              <span className="icon-coin"></span>
              <span>{dataTie.totalStakes}</span>
            </div>
            <div className="flex items-center players gap-1 justify-center">
              <span className="icon-user"></span>
              <span>{dataTie.players}</span>
            </div>
          </div>
          <div className="bet-name text-center mt-4">{dataTie.betChoice}</div>
          <div className="bet-odds text-center">{dataTie.odds}</div>
          <div className={`own-bet ${Style["own-bet"]}`}>
            <span className="bet-value">10</span>
          </div>
        </div>
      </div>
      <RoundResult roundId={20} resultData={resultData} />
      <Scoreboard />
    </>
  );
}
