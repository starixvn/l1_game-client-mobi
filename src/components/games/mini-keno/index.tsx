import { withTranslation } from "next-i18next";
import { withRouter } from "next/router";
import React from "react";

import { RoundResultCollapse } from "../keno-pro-max/round-result";
import { MegaKenoResult } from "../mega-keno/mega-keno-result";
import { KenoProMax } from "../keno-pro-max";

export class MiniKeno extends KenoProMax {
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
            <RoundResultCollapse
                result={result ?? this.getFakeResult()}
                settlementResult={settlementResult ?? this.getFakeSettlementResult()}
                gameState={gameState}
            />
        );
    }
}

export default withRouter(withTranslation()(MiniKeno));
