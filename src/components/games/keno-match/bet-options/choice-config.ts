type ChoiceConfig = {
    name: string;
    displayedName: string;
    bettypeName?: string;
    isShowTooltip: boolean;
    tooltipMessage?: string;
};

interface IKenoMatchConfig {
    name: string;
    config: ChoiceConfig[];
}

export const KenoMatchConfigs: IKenoMatchConfig[] = [
    {
        name: "firstHalf",
        config: [
            {
                name: "fhBlue",
                displayedName: "blue",
                bettypeName: "bettype-fhBlue",
                isShowTooltip: false,
            },
            {
                name: "fhRed",
                displayedName: "red",
                bettypeName: "bettype-fhRed",
                isShowTooltip: false,
            },
            {
                name: "total",
                displayedName: "total",
                isShowTooltip: false,
            },
            {
                name: "fhOver",
                displayedName: "over",
                bettypeName: "bettype-fhOver",
                isShowTooltip: true,
                tooltipMessage: "[811~1410]",
            },
            {
                name: "fhUnder",
                displayedName: "under",
                bettypeName: "bettype-fhUnder",
                isShowTooltip: true,
                tooltipMessage: "[210~810]",
            },
            {
                name: "fhEven",
                displayedName: "even",
                bettypeName: "bettype-fhEven",
                isShowTooltip: false,
            },
            {
                name: "fhOdd",
                displayedName: "odd",
                bettypeName: "bettype-fhOdd",
                isShowTooltip: false,
            },
        ],
    },
    {
        name: "fullTime",
        config: [
            {
                name: "ftBlue",
                displayedName: "blue",
                bettypeName: "bettype-ftBlue",
                isShowTooltip: false,
            },
            {
                name: "ftRed",
                displayedName: "red",
                bettypeName: "bettype-ftRed",
                isShowTooltip: false,
            },
            {
                name: "total",
                displayedName: "total",
                isShowTooltip: false,
            },
            {
                name: "ftOver",
                displayedName: "over",
                bettypeName: "bettype-ftOver",
                isShowTooltip: true,
                tooltipMessage: "[1621~2820]",
            },
            {
                name: "ftUnder",
                displayedName: "under",
                bettypeName: "bettype-ftUnder",
                isShowTooltip: true,
                tooltipMessage: "[420~1620]",
            },
            {
                name: "ftEven",
                displayedName: "even",
                bettypeName: "bettype-ftEven",
                isShowTooltip: false,
            },
            {
                name: "ftOdd",
                displayedName: "odd",
                bettypeName: "bettype-ftOdd",
                isShowTooltip: false,
            },
        ],
    },
    {
        name: "fullTimeLive",
        config: [
            {
                name: "liveFTBlue",
                displayedName: "blue",
                bettypeName: "bettype-liveFTBlue",
                isShowTooltip: false,
            },
            {
                name: "liveFTRed",
                displayedName: "red",
                bettypeName: "bettype-liveFTRed",
                isShowTooltip: false,
            },
            {
                name: "total",
                displayedName: "total",
                isShowTooltip: false,
            },
            {
                name: "liveFTOver",
                displayedName: "over",
                bettypeName: "bettype-liveFTOver",
                isShowTooltip: true,
                tooltipMessage: "[1621~2820]",
            },
            {
                name: "liveFTUnder",
                displayedName: "under",
                bettypeName: "bettype-liveFTUnder",
                isShowTooltip: true,
                tooltipMessage: "[420~1620]",
            },
            {
                name: "liveFTEven",
                displayedName: "even",
                bettypeName: "bettype-liveFTEven",
                isShowTooltip: false,
            },
            {
                name: "liveFTOdd",
                displayedName: "odd",
                bettypeName: "bettype-liveFTOdd",
                isShowTooltip: false,
            },
        ],
    },
];

export const choicesMapper = {
    fhBlue: "blue",
    fhRed: "red",
    fhOver: "over",
    fhUnder: "under",
    fhOdd: "odd",
    fhEven: "even",
    ftBlue: "blue",
    ftRed: "red",
    ftOver: "over",
    ftUnder: "under",
    ftOdd: "odd",
    ftEven: "even",
    liveFTBlue: "blue",
    liveFTRed: "red",
    liveFTOver: "over",
    liveFTUnder: "under",
    liveFTOdd: "odd",
    liveFTEven: "even",
};
