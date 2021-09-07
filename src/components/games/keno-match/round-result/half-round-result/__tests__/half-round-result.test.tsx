import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import {Tie} from "../half-round-result";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
//   unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("Tie renders correct", () => {
    act(() => {
      render(<Tie  number={5}/>, container);
    });

    expect(container.textContent).toBe("5");
  });