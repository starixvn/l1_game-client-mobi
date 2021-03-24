import { SocketContextProvider } from "../../contexts/socket";
import GameBase from "../../shared/game-base";
import { GameBaseProps, GameBaseState, GameState } from "../../shared/game-base/type";
import GameContainer from "../../shared/game-container";
import SeDieBetOptions from "./se-die-bet-options";
import { Result, SettlementResult } from "./sedie";
import SeDieStatistic from "./se-die-statistic";



class SeDie extends GameBase<GameBaseProps, GameBaseState<Result, SettlementResult>> {
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

    render() {
        const { gameName, id } = this.props;
        const { remainingTime, roundId, gameState, roundHistory, gameConfigs, signedIn, result, settlementResult } = this.state;

        return signedIn ? (
            <GameContainer gameId={id} gameName={gameName} remainingTime={remainingTime} roundId={roundId} gameState={gameState}>
                <SocketContextProvider value={this.socket}>
                    <SeDieBetOptions
                        odds={gameConfigs.odds}
                        gameState={gameState}
                        result={result}
                        settlementResult={settlementResult}
                    ></SeDieBetOptions>
                </SocketContextProvider>
                <SeDieStatistic roundHistory={roundHistory} gameState={gameState}></SeDieStatistic>
            </GameContainer>
        ) : (
            <div>Loading...</div>
        );
    }
}

export default SeDie;
