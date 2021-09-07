// import '@testing-library/jest-dom';
import { render, screen } from "@testing-library/react";
import React from "react";

import { TeamResultRow, Tie } from "..";

test("Tie component render correct", () => {
    render(<Tie number={5} />);
    const component = screen.getByText("5");

    expect(component).toHaveClass("number");
    expect(component).toContainHTML('<div class="number" data-testid="tie-component">5</div>');
});

test("TeamResultRow component render correct", () => {
    render(<TeamResultRow result={[5, 6, 7, 8, 9]} />);

    expect(document.getElementsByClassName("number").length).toEqual(5);
    expect(document.getElementsByClassName("row").length).toEqual(1);
});
