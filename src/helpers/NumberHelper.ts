const numberWithCommas = (number, toFixed = 2, noZeroSuffix = true) => {
    if (number) {
        const result = parseFloat(number).toFixed(toFixed).toString().split(".");
        result[0] = result[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        if (noZeroSuffix) {
            return +result[1] !== 0 ? result.join(".") : result[0];
        } else {
            return result.join(".");
        }
    }
    return "0";
};

export { numberWithCommas };
