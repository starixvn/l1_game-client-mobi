import { render } from "@testing-library/react";
import React from "react";
import * as rdd from "react-device-detect";

import BaseDialog from ".";
import { ModalType } from "../../shared/base-dialog/type";

describe("BaseDialog", () => {
    test.each`
        modalType            | className
        ${ModalType.Full}    | ${".modal-full"}
        ${ModalType.Message} | ${".modal-message"}
        ${ModalType.Center}  | ${".modal-center"}
        ${ModalType.Rebet}   | ${".modal-rebet"}
    `("should render class modal type", ({ modalType, className }) => {
        // Arrange
        const source = { type: modalType, isOpen: true, onCloseModal: jest.fn };

        // Act
        render(<BaseDialog {...source} />);

        // Assert
        expect(document.querySelector(className)).toBeTruthy();
    });

    test.each`
        isMobile | isIOS    | className
        ${true}  | ${true}  | ${".ios-device"}
        ${true}  | ${false} | ${".android-device"}
        ${true}  | ${false} | ${".isMobile"}
    `("should render class follow device", ({ isMobile, isIOS, className }) => {
        // Arrange
        const source = { isOpen: true, onCloseModal: jest.fn, enableBackdrop: true };
        rdd.isIOS = isIOS;
        rdd.isMobileOnly = isMobile;

        // Act
        render(<BaseDialog {...source} />);

        // Assert
        expect(document.querySelector(className)).toBeTruthy();
    });

    test.each`
        betContainerPosition
        ${10}
        ${window.innerHeight}
    `("custom position BaseDialog when show", ({ betContainerPosition }) => {
        // Arrange
        const source = { isOpen: true, onCloseModal: jest.fn, enableBackdrop: true, betContainerPosition: betContainerPosition };

        // Act
        render(<BaseDialog {...source} />);

        // Assert
        expect(document.querySelector(".popup")).toBeTruthy();
    });
});
