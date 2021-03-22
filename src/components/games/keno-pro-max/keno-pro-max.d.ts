export interface SettlementResult {
    big: boolean
    small: boolean
    even: boolean
    odd: boolean
    earth: boolean
    fire: boolean
    gold: boolean
    water: boolean
    wood: boolean
}

export interface Result {
    red1: boolean
    red2: boolean
    red3: boolean
    red4: boolean
}

export interface WinningPlayers {
    bet: number
    win: boolean
    winningByChoices: SettlementResult
}

export interface KenoProMax {
    roundId: number
    result: number[]
    settlementResult: SettlementResult
    winningPlayers: WinningPlayers[]
}

export interface Player {
    avatarId: string
    id: string
    name: string
    red: number
    type: boolean
}

export interface RoundHistory {
    result: number[]
    roundId: number
    settlementResult: SettlementResult
}
