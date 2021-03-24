import GameBase from "../../shared/game-base";
import { GameBaseProps, GameBaseState, GameState } from "../../shared/game-base/type";
import { SettlementResult } from "./keno-pro-max-type";
import KenoBetOptions from "./keno-pro-max-bet-options";

class KenoProMax extends GameBase<GameBaseProps, GameBaseState<number[], SettlementResult>> {
    constructor(props: GameBaseProps) {
        super(props);

        this.state = {
            signedIn: false,
            gameState: GameState.None,
            remainingTime: 0,
            gameConfigs: null,
            roundHistory: [],
            roundId: 0,
        };
    }

    renderGame() {
        const { gameState, roundHistory, gameConfigs, result, settlementResult } = this.state;

        return <KenoBetOptions odds={gameConfigs.odds} gameState={gameState} result={result} settlementResult={settlementResult} />;
    }
}

export default KenoProMax;
