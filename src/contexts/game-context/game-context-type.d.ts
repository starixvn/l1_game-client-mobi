import { GameState } from "../../components/shared/game-base/type";

export type GameContextModel = {
    updateGameState: (gameState: GameState) => void;
    placeBet: (betChoice: string, amount: number) => void;
    totalBets: object;
    ownBets: object;
    gameName: string;
    roundId: number;
};
