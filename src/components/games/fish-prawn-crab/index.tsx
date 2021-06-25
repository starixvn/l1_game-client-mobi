import { withTranslation } from "next-i18next";
import { withRouter } from "next/router";
import React from "react";

import { CommonResourceKeys, GameResourceKeys } from "../../../common/resources";
import FishPrawnCrabGuide from "../../game-guide/fish-prawn-crab";
import AdvanceModal from "../../shared/advance-modal";
import GameBase from "../../shared/game-base";
import { GameBaseProps, GameBaseState } from "../../shared/game-base/type";
import ScoreboardBasic from "../../shared/round-history/scoreboard/basic";
import FishPrawnCrabBetHistory from "./bet-history";
import FishPrawnCrabBetOptions from "./bet-options";
import { Result, SettlementResult } from "./fish-prawn-crab";
import FishPrawnCrabResult, { FishPrawnCrabResultCollapse } from "./fish-prawn-crab-result";
import OddComponent from "./odd";
import GetElementRound from "./scoreboard-round-history";
import StatisticComponent from "./statistic";
import Styles from "./fish-prawn-crab.module.scss";

export const choicesMapper = { stag: 0, gourd: 1, rooster: 2, fish: 3, crab: 4, prawn: 5 };
export const OddNames = {
    single: "single",
    double: "double",
    triple: "triple",
};
export enum ResultBet {
    stag,
    gourd,
    rooster,
    fish,
    crab,
    prawn,
}

const DefaultOdds = "single";
const DiceImgMapper = ["dice-nai", "dice-bau", "dice-ga", "dice-ca", "dice-cua", "dice-tom"];

class FishPrawnCrab extends GameBase<GameBaseProps, GameBaseState<Result, SettlementResult>> {
    constructor(props: GameBaseProps) {
        super(props);

        this.state = { ...this.defaultState };
    }

    getMainOptions(): string[] {
        return Object.keys(choicesMapper);
    }

    getOddsByChoice(choice: string) {
        const { gameConfigs } = this.state;
        const odds = gameConfigs.odds;

        return odds[DefaultOdds];
    }

    renderBetOptions() {
        const { gameState, settlementResult, result, showWinningAnimation } = this.state;
        return (
            <FishPrawnCrabBetOptions
                gameState={gameState}
                settlementResult={settlementResult ?? { crab: false, fish: false, gourd: false, prawn: false, rooster: false, stag: false }}
                result={result}
                isShowWinningEffect={showWinningAnimation}
            />
        );
    }

    renderRoundHistory() {
        return <OddComponent />;
    }

    renderStatistic() {
        return <StatisticComponent roundHistory={this.state.roundHistory.slice(0, 30)}></StatisticComponent>;
    }

    renderResult() {
        const { result } = this.state;
        return <FishPrawnCrabResult result={result}></FishPrawnCrabResult>;
    }

    renderResultCollapse() {
        const { result } = this.state;
        return <FishPrawnCrabResultCollapse result={result} />;
    }

    renderBoard() {
        const { gameState, roundHistory } = this.state;
        return (
            <ScoreboardBasic
                roundHistory={roundHistory.slice(0, 30)}
                gameState={gameState}
                getElementRound={GetElementRound}
            ></ScoreboardBasic>
        );
    }

    renderGuide() {
        const gameName = this.props.t(`${this.props.gameName.toLowerCase()}:${GameResourceKeys.GAME_NAME}`);
        return (
            <AdvanceModal
                title={CommonResourceKeys.GUIDE_POPUP_TITLE}
                gameName={`(${gameName})`}
                isOpen={true}
                onCloseModal={() => this.closePopup()}
                isAddScrollBody={true}
            >
                <FishPrawnCrabGuide />
            </AdvanceModal>
        );
    }

    renderBetHistory() {
        const gameName = this.props.t(`${this.props.gameName.toLowerCase()}:${GameResourceKeys.GAME_NAME}`);
        return (
            <AdvanceModal
                title={CommonResourceKeys.HISTORY_POPUP_TITLE}
                gameName={`(${gameName})`}
                isOpen={true}
                onCloseModal={() => this.closePopup()}
                isAddScrollBody={true}
            >
                <FishPrawnCrabBetHistory />
            </AdvanceModal>
        );
    }

    renderResultInfo() {
        const { result } = this.state;

        return (
            <div>
                {Object.values(result).map((dice, index) => {
                    const src = `/static/images/${DiceImgMapper[dice]}.png`;
                    return (
                        <div key={index} className={Styles[`dice-${index}`]}>
                            <img src={src} className={Styles["dice"]} alt="dice" />
                        </div>
                    );
                })}
            </div>
        );
    }

    renderSettlementInfo() {
        const { result } = this.state;
        const settlementResultInfo = Object.values(result).map((dice) => this.getGameTranslate(Object.keys(choicesMapper)[dice]));

        return <div>{`${settlementResultInfo[0]} - ${settlementResultInfo[1]} - ${settlementResultInfo[2]}`}</div>;
    }
}

export default withRouter(withTranslation()(FishPrawnCrab));
