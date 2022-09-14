import { withTranslation } from "next-i18next";
import { withRouter } from "next/router";
import React from "react";

import { MegaKenoRoundResultCollapse, RoundResultCollapse } from "../keno-pro-max/round-result";
import { MegaKenoResult } from "../keno-pro-max/round-result/mini-keno-result";
import { KenoProMax, DefaultTooltipMessageFollowChoiceProps } from "../keno-pro-max";
import { TooltipMessageFollowChoiceProps } from "../keno-pro-max/bet-options";

const KenoMiniTooltipMessageFollowChoiceProps = {
    big: `[206~355]`,
    small: `[55~205]`,
    gold: `[55~163]`,
    wood: `[164~187]`,
    water: `[188~222]`,
    fire: `[223~246]`,
    earth: `[247~355]`,
};

export class MiniKeno extends KenoProMax {
    renderRawValueMD5() {
        const { md5ResultKey } = this.state;

        return (
            <>
                <strong>{this.props.t("common:md5Result")}: </strong>
                <span>{md5ResultKey}</span>
            </>
        );
    }
    getFakeSettlementResult() {
        const { roundHistory } = this.state;
        return (
            roundHistory?.[0]?.settlementResult ?? {
                big: true,
                earth: false,
                even: true,
                fire: false,
                gold: false,
                odd: false,
                small: false,
                water: true,
                wood: false,
            }
        );
    }

    get isShowInlineResult() {
        return false;
    }

    get isShowPoolStake() {
        return false;
    }

    get winningAnimationWaitingTimeInSecond() {
        return this.props.durations.showResult * 1000;
    }

    get tooltipMessageFollowChoiceProps(): TooltipMessageFollowChoiceProps {
        return this.isKenoMini() ? KenoMiniTooltipMessageFollowChoiceProps : DefaultTooltipMessageFollowChoiceProps;
    }

    isKenoMini(): boolean {
        const { id } = this.props;
        return id === 14 || id === 15;
    }

    getFakeResult() {
        const { roundHistory } = this.state;
        return roundHistory?.[0]?.result ?? [7, 9, 11, 15, 20, 22, 28, 30, 32, 34, 37, 47, 49, 53, 64, 67, 68, 70, 78, 79];
    }

    renderResult() {
        const { result, settlementResult } = this.state;
        return (
            <MegaKenoResult result={result ?? this.getFakeResult()} settlementResult={settlementResult ?? this.getFakeSettlementResult()} />
        );
    }

    renderResultCollapse() {
        const { result, settlementResult, gameState } = this.state;
        return (
            <MegaKenoRoundResultCollapse
                result={result ?? this.getFakeResult()}
                settlementResult={settlementResult ?? this.getFakeSettlementResult()}
                gameState={gameState}
            />
        );
    }
}

export default withRouter(withTranslation()(MiniKeno));
