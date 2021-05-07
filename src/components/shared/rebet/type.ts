export interface Props {
    gameId: number;
    onCloseModal: Function;
}

export interface BetTrackModel {
    message?: string;
    state: BetState;
    validAmount?: number;
}

export enum BetState {
    Waiting,
    Success,
    Error,
}
