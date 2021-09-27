export enum StateRound {
    ht,
    ft,
    live,
}

export const detectStateRound = (choice: string): number => {
    let stateRound = StateRound.ht;

    if (choice.includes("ft")) {
        stateRound = StateRound.ft;
    } else if (choice.includes("liveFT")) {
        stateRound = StateRound.live;
    }

    return stateRound;
};
