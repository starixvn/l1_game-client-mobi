const numberWithCommas = (number: number, toFixed = 2) => {
    return number.toLocaleString("en-US", { maximumFractionDigits: toFixed });
};

const randomInteger = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const isNumber = (char: string) => /^-?[\d.]+(?:e-?\d+)?$/.test(char);

export { numberWithCommas, randomInteger, isNumber };
