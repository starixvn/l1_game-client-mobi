import { GameBaseProps, GameConfigs, GameState, ViewMode } from "../../components/shared/game-base/type";
import {KenoMatchGameState, KenoMatchGameSetting, KenoMatchProps} from "../../components/games/keno-match/type";

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
    kenoMatchGameState:KenoMatchGameState;
    // kenoMatchGameSetting: KenoMatchProps;
};
