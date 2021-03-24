import { GameState } from "../../shared/game-base/type";

export type GameContextModel = {
    updateGameState: (gameState: GameState) => void;
    placeBet: (betChoice: string, amount: number) => void;
};
