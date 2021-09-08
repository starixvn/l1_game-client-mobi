// import '@testing-library/jest-dom';
import { render, fireEvent, screen } from "@testing-library/react";
import React from "react";
import { Tie, Team, HalfRoundResult, HalfResultPopup } from ".";

jest.mock("next-i18next", () => ({
    useTranslation: () => ({
        t: (key: string): string => key,
    }),
}));

describe("Tie", () => {
    test("should be have `number` class", () => {
        render(<Tie number={5} />);
        expect(screen.getByTestId("tie-component")).toHaveClass("number");
    });

    test.each`
        result | expectedInnerHtml
        ${5}   | ${"5"}
        ${-1}  | ${""}
    `("should render inner html correctly", ({ result, expectedInnerHtml }) => {
        render(<Tie number={result} />);

        expect(screen.getByTestId("tie-component").innerHTML).toEqual(expectedInnerHtml);
    });
});

test("Tie should be render correctly", () => {
    render(<Tie number={5} />);
    const component = screen.getByTestId("tie-component");

    expect(component.innerHTML).toEqual("5");
    expect(component).toHaveClass("number");
});

// test("TeamResultRow should be render correctly", () => {
//     render(<TeamResultRow result={[5, 6, 7, 8, 9]} />);

//     expect(screen.getAllByTestId("tie-component")).toHaveLength(5);
//     expect(screen.getByTestId("team-result-row-component")).toHaveClass("row");
// });

test("Team should be render correctly", () => {
    const result = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        teamName = "red";

    render(<Team {...{ result, teamName }} />);

    const component = screen.getByTestId("team-component");
    expect(component).toHaveClass("team");
    expect(screen.getAllByTestId("team-result-row-component")).toHaveLength(2);
    expect(document.getElementsByClassName("team-name")).toHaveLength(1);

    const teamNameElements = document.getElementsByClassName("name");
    expect(teamNameElements).toHaveLength(1);
    expect(teamNameElements[0].innerHTML).toEqual("red:");

    const scoreElements = document.getElementsByClassName("score");
    expect(scoreElements).toHaveLength(1);
    expect(scoreElements[0].innerHTML).toEqual("55");
});

const buildProps = (active: boolean) => {
    return {
        result: {
            blue: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            red: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        },
        active,
        className: "custom-class",
        headerText: "header red",
        gameName: "keno match",
    };
};

describe("HalfRoundResult", () => {
    test("should be render correctly", () => {
        render(<HalfRoundResult {...buildProps(true)} />);

        const component = screen.getByTestId("half-round-result-component");
        expect(component).toHaveClass("result custom-class");

        expect(document.getElementsByClassName("blue")).toHaveLength(1);
        expect(document.getElementsByClassName("red")).toHaveLength(1);
        expect(document.getElementsByClassName("main-content")).toHaveLength(1);
        expect(document.getElementsByClassName("middle-column")).toHaveLength(1);

        const headerElements = document.getElementsByClassName("name");
        expect(headerElements).toHaveLength(3);
        expect(headerElements[1].innerHTML).toEqual("header red");

        const totalWrapperElements = document.getElementsByClassName("score-wrapper");
        expect(totalWrapperElements).toHaveLength(1);
        expect(totalWrapperElements[0].innerHTML).toEqual('total <div class="score">110</div>');

        const totalElements = document.getElementsByClassName("score");
        expect(totalElements).toHaveLength(3);
        expect(totalElements[1].innerHTML).toEqual("110");

        expect(screen.getAllByTestId("team-component")).toHaveLength(2);
    });

    test.each`
        active   | expectedResult
        ${true}  | ${1}
        ${false} | ${0}
    `("should render active classname correctly", ({ active, expectedResult }) => {
        render(<HalfRoundResult {...buildProps(active)} />);

        expect(document.getElementsByClassName("active")).toHaveLength(expectedResult);
    });
});

// describe("HalfResultPopup", () => {
//     test("should be render correctly", () => {
//         render(<HalfResultPopup {...buildProps(true)} />);

//         const component = screen.getByTestId("half-round-result-component");
//         expect(component).toHaveClass("result custom-class");

//         expect(document.getElementsByClassName("blue")).toHaveLength(1);
//         expect(document.getElementsByClassName("red")).toHaveLength(1);
//         expect(document.getElementsByClassName("main-content")).toHaveLength(1);
//         expect(document.getElementsByClassName("middle-column")).toHaveLength(1);

//         const headerElements = document.getElementsByClassName("name");
//         expect(headerElements).toHaveLength(3);
//         expect(headerElements[1].innerHTML).toEqual("header red");

//         const totalWrapperElements = document.getElementsByClassName("score-wrapper");
//         expect(totalWrapperElements).toHaveLength(1);
//         expect(totalWrapperElements[0].innerHTML).toEqual('total <div class="score">110</div>');

//         const totalElements = document.getElementsByClassName("score");
//         expect(totalElements).toHaveLength(3);
//         expect(totalElements[1].innerHTML).toEqual("110");

//         expect(screen.getAllByTestId("team-component")).toHaveLength(2);
//     });

//     test.each`
//         active   | expectedResult
//         ${true}  | ${1}
//         ${false} | ${0}
//     `("should render active classname correctly", ({ active, expectedResult }) => {
//         render(<HalfRoundResult {...buildProps(active)} />);

//         expect(document.getElementsByClassName("active")).toHaveLength(expectedResult);
//     });
// });
