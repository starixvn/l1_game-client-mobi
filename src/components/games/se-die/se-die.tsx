import { SocketContextProvider } from "../../contexts/socket";
import GameBase from "../../shared/game-base";
import { GameBaseProps, GameBaseState, GameState } from "../../shared/game-base/type";
import GameContainer from "../../shared/game-container";
import MiniStatistic from "../../shared/statistic/line";
import Statistic from "../../shared/statistic/scoreboard";
import SeDieBetOptions from "./se-die-bet-options";

class SeDie extends GameBase<GameBaseProps, GameBaseState> {
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
        const { remainingTime, roundId, gameState, roundHistory, gameConfigs, signedIn } = this.state;
        const typeDiceResult = ["red1", "red2", "red3", "red4"];
        return signedIn ? (
            <GameContainer gameId={id} gameName={gameName} remainingTime={remainingTime} roundId={roundId} gameState={gameState}>
                <SocketContextProvider value={this.socket}>
                    <SeDieBetOptions odds={gameConfigs.odds}></SeDieBetOptions>
                </SocketContextProvider>

                <MiniStatistic results={roundHistory} gameState={gameState} countItem={20} typeDiceResult={typeDiceResult}></MiniStatistic>
                <Statistic results={roundHistory} gameState={gameState} typeDiceResult={typeDiceResult}></Statistic>
            </GameContainer>
        ) : (
            <div>Loading...</div>
        );
    }
}

export default SeDie;
