import { render, waitFor } from "@testing-library/react";
import React from "react";
import { act } from "react-dom/test-utils";

import ResultDetail, { HidingAnimationDurationInSecond } from ".";

describe("ResultDetail", () => {
    beforeEach(() => {
        jest.useFakeTimers();
        jest.spyOn(global, "setTimeout");
    });
    const showResultTimeInSecond = 3;
    test("renders ResultDetail component", async () => {
        const showResultTimeInSecond = 3;
        const { getByText } = render(
            <ResultDetail renderSettlementInfo={() => <span>{"children"}</span>} timeToShowInSecond={showResultTimeInSecond} />
        );

        expect(getByText("children")).toBeInTheDocument();
        expect(setTimeout).toHaveBeenCalledTimes(2);
        expect(setTimeout).toHaveBeenLastCalledWith(
            expect.any(Function),
            (showResultTimeInSecond - HidingAnimationDurationInSecond) * 1000
        );
    });

    test("add class hide ResultDetail component", async () => {
        render(<ResultDetail renderSettlementInfo={() => <span>{"children"}</span>} timeToShowInSecond={showResultTimeInSecond} />);
        act(() => {
            jest.runOnlyPendingTimers();
        });

        await waitFor(() => {
            expect(document.querySelector(".hide-result-animation")).toBeTruthy();
        });
    });
});
