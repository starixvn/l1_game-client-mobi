import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { act } from "react-dom/test-utils";

import BaseResult, { HidingAnimationTimeInSecond } from ".";

describe("BaseResult", () => {
    beforeEach(() => {
        jest.useFakeTimers();
        jest.spyOn(global, "setTimeout");
    });
    test("renders BaseResult component", async () => {
        const showResultTimeInSecond = 3;
        const { getByText } = render(<BaseResult showResultTimeInSecond={showResultTimeInSecond}>{"children"}</BaseResult>);

        expect(getByText("children")).toBeInTheDocument();
        expect(setTimeout).toHaveBeenCalledTimes(2);
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), (showResultTimeInSecond - HidingAnimationTimeInSecond) * 1000);
    });

    test("add class hide BaseResult component", async () => {
        render(<BaseResult showResultTimeInSecond={3}>{"children"}</BaseResult>);
        act(() => {
            jest.runOnlyPendingTimers();
        });

        await waitFor(() => {
            expect(document.querySelector(".hide-result-animation")).toBeTruthy();
        });
    });
});
