import GameBase from "../../shared/game-base";
import { GameBaseProps, GameBaseState, GameState } from "../../shared/game-base/type";
import GameContainer from "../../shared/game-container";

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
        const { gameName } = this.props;
        const { remainingTime, roundId, gameState } = this.state;
        return (
            <GameContainer gameName={gameName} remainingTime={remainingTime} roundId={roundId} gameState={gameState}>
                <div></div>
            </GameContainer>
        );
    }
}

export default SeDie;
