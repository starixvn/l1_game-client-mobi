import { withTranslation } from "next-i18next";
import { withRouter } from "next/router";
import React from "react";

import { SeDie } from "../se-die/se-die";
import SpecialSeDieBetOptions from "./bet-options";

class SpecialSeDie extends SeDie {
    get Choices() {
        return ["even", "odd"];
    }

    handleFinish({ finish }) {
        super.handleFinish({ finish });

        const { totalBets } = this.state;
        const totalBetValues = Object.values(totalBets);
        const balancedBetAmount = Math.min(...[totalBetValues[0] ?? 0, totalBetValues[1] ?? 0]);
        this.Choices.forEach((choice) => {
            totalBets[choice] = balancedBetAmount;
        });
        this.setState({ totalBets });
    }

    renderBetOptions() {
        const { gameState, settlementResult, showWinningAnimation, betPercentage } = this.state;
        const fakeSettlementResult = { even: false, odd: false, red2: false, red3: false, red4: false, white3: false, white4: false };
        return (
            <SpecialSeDieBetOptions
                choices={this.Choices}
                gameState={gameState}
                settlementResult={settlementResult ?? fakeSettlementResult}
                isShowWinningEffect={showWinningAnimation}
                betPercentage={betPercentage}
            />
        );
    }
}

export default withRouter(withTranslation()(SpecialSeDie));
