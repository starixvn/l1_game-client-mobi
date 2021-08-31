import { TFunction } from "next-i18next";
import { Result } from "./type";

export const defaultResult = {
    blue: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    red: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
};

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

export const Choices = {
    blue: "blue",
    red: "red",
    over: "over",
    under: "under",
    odd: "odd",
    even: "even",
};


export const KenoMatchConfigs = {
    choices:  {
        firstHalf: {
            name: "First Half",
        config : [{
            name:"fhBlue",
            displayedName: "blue"
        },
        {
            name:"fhRed",
            displayedName: "red"
        },
        {
            name:"total",
            displayedName: "total"
        },
        {
            name:"fhOver",
            displayedName: "over"
        },
        {
            name:"fhUnder",
            displayedName: "under"
        },
        {
            name:"fhEven",
            displayedName: "even"
        },
        {
            name:"fhOdd",
            displayedName: "odd"
        }]}, 
        fullTime:  {
            name: "Full Time",
        config: [{
            name:"ftBlue",
            displayedName: "blue"
        },
        {
            name:"ftRed",
            displayedName: "red"
        },
        {
            name:"total",
            displayedName: "total"
        },
        {
            name:"ftOver",
            displayedName: "over"
        },
        {
            name:"ftUnder",
            displayedName: "under"
        },
        {
            name:"ftEven",
            displayedName: "even"
        },
        {
            name:"ftOdd",
            displayedName: "odd"
        }]},
        liveFullTime:   {
            name: "Live",
        config: [{
            name:"liveFTBlue",
            displayedName: "blue"
        },
        {
            name:"liveFTRed",
            displayedName: "red"
        },
        {
            name:"total",
            displayedName: "total"
        },
        {
            name:"liveFTOver",
            displayedName: "over"
        },
        {
            name:"liveFTUnder",
            displayedName: "under"
        },
        {
            name:"liveFTEven",
            displayedName: "even"
        },
        {
            name:"liveFTOdd",
            displayedName: "odd"
        }]}
    }
};

export const GetTranslateChoiceMapping = (t: TFunction, gameName = "kenomatch1") => {
    return {
        blue: t(`${gameName}:blue`),
        red: t(`${gameName}:red`),
        over: t(`${gameName}:over`),
        under: t(`${gameName}:under`),
        odd: t(`${gameName}:odd`),
        even: t(`${gameName}:even`)
    };
};
