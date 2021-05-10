export const AudioCollection = {
    selectChip: "./static/sounds/chip-click.mp3",
    placeBet: "./static/sounds/place-bet.mp3",
};

export const playSound = (url: string) => {
    const sound = new Audio(url);

    sound && sound.play();
};
