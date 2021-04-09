export interface Props {
    gameId: number;
    onCloseModal: Function;
}

export interface BetTrackModel {
    message?: string;
    state: BetState;
}

export enum BetState {
    Waiting,
    Success,
    Error,
}
