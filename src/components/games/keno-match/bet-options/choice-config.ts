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
                bettypeName: "FirstHalfTeamBlueTeamRed",
                isShowTooltip: false,
            },
            {
                name: "fhRed",
                displayedName: "red",
                bettypeName: "FirstHalfTeamBlueTeamRed",
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
                bettypeName: "FirstHalfOverUnder",
                isShowTooltip: true,
                tooltipMessage: "[811~1410]",
            },
            {
                name: "fhUnder",
                displayedName: "under",
                bettypeName: "FirstHalfOverUnder",
                isShowTooltip: true,
                tooltipMessage: "[210~810]",
            },
            {
                name: "fhEven",
                displayedName: "even",
                bettypeName: "FirstHalfEvenOdd",
                isShowTooltip: false,
            },
            {
                name: "fhOdd",
                displayedName: "odd",
                bettypeName: "FirstHalfEvenOdd",
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
                bettypeName: "FullTimeTeamBlueTeamRed",
                isShowTooltip: false,
            },
            {
                name: "ftRed",
                displayedName: "red",
                bettypeName: "FullTimeTeamBlueTeamRed",
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
                bettypeName: "FullTimeOverUnderRed",
                isShowTooltip: true,
                tooltipMessage: "[1621~2820]",
            },
            {
                name: "ftUnder",
                displayedName: "under",
                bettypeName: "FullTimeOverUnderRed",
                isShowTooltip: true,
                tooltipMessage: "[420~1620]",
            },
            {
                name: "ftEven",
                displayedName: "even",
                bettypeName: "FullTimeEvenOdd",
                isShowTooltip: false,
            },
            {
                name: "ftOdd",
                displayedName: "odd",
                bettypeName: "FullTimeEvenOdd",
                isShowTooltip: false,
            },
        ],
    },
    {
        name: "fullTime",
        config: [
            {
                name: "liveFTBlue",
                displayedName: "blue",
                bettypeName: "FullTimeTeamBlueTeamRedLive",
                isShowTooltip: false,
            },
            {
                name: "liveFTRed",
                displayedName: "red",
                bettypeName: "FullTimeTeamBlueTeamRedLive",
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
                bettypeName: "FullTimeOverUnderLive",
                isShowTooltip: false,
            },
            {
                name: "liveFTUnder",
                displayedName: "under",
                bettypeName: "FullTimeOverUnderLive",
                isShowTooltip: false,
            },
            {
                name: "liveFTEven",
                displayedName: "even",
                bettypeName: "FullTimeEvenOddLive",
                isShowTooltip: false,
            },
            {
                name: "liveFTOdd",
                displayedName: "odd",
                bettypeName: "FullTimeEvenOddLive",
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