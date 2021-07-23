import { GameBaseProps, GameConfigs, GameState, UserStakeLevel, ViewMode } from "../../components/shared/game-base/type";

export type GameContextModel = {
    totalBets: object;
    ownBets: object;
    gameSetting: GameBaseProps;
    roundId: number;
    remainingTime: number;
    gameConfigs: GameConfigs;
    gameState: GameState;
    viewMode: ViewMode;
    playResultAnimation: boolean;
    isShowBlink: boolean;
};
