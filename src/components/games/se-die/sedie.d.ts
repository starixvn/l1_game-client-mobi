export interface SettlementResult {
  even: boolean;
  odd: boolean;
  red2: boolean;
  red3: boolean;
  red4: boolean;
  white3: boolean;
  white4: boolean;
}

export interface Result {
  red1: boolean;
  red2: boolean;
  red3: boolean;
  red4: boolean;
}

export interface WinningPlayers {
  bet: number;
  win: boolean;
  winningByChoices: SettlementResult;
}

export interface Sedie {
  roundId: number;
  result: Result;
  settlementResult: SettlementResult;
  winningPlayers: WinningPlayers[];
}

export interface Player {
  avatarId: string;
  id: string;
  name: string;
  red: number;
  type: boolean;
}
