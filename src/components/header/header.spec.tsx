// Mock dependencies first
jest.mock("../../common/app-settings", () => ({
    getAppSettings: jest.fn(() => ({
        system: "l2",
        appType: 2,
    })),
}));

jest.mock("../../common/local-storage", () => ({
    getLocalStorageItem: jest.fn(() => null),
    localStorageKeys: {
        operator: "test-operator-key",
    },
}));

jest.mock("../../common/constants", () => ({
    systemName: "l2",
    isL1System: jest.fn(),
    isSabaPlay: jest.fn((operator) => operator === "SP"),
    AppTypes: {
        mobile: 2,
        megaKeno: 4,
    },
    buildVersion: "1.0.0",
}));

import { render, screen } from "@testing-library/react";
import React from "react";

import Header, { getLogoName } from ".";

jest.mock("../shared/settings", () => ({
    Settings: jest.fn(() => <div data-testid="settings">Settings</div>),
}));

jest.mock("../user-info", () => ({
    UserInfo: jest.fn(() => <div data-testid="user-info">UserInfo</div>),
}));

jest.mock("react-device-detect", () => ({
    isMobileOnly: false,
}));

describe("Header", () => {
    const mockUser = {
        UID: 1,
        name: "Test User",
        avatarId: 1,
        currency: "USD",
        red: 1000,
        isSignedInSM: true,
        settings: { theme: "light" },
        offerGames: [],
        enabledGameIds: [],
        availSpins: 0,
        scoins: 0,
    } as any;

    const defaultProps = {
        user: mockUser,
        enabledSound: true,
        enabledNotification: true,
        onToggleSound: jest.fn(),
        onToggleNotification: jest.fn(),
        toggleHistoryModal: jest.fn(),
        toggleGuideModal: jest.fn(),
        toggleAnnouncementModal: jest.fn(),
        updateFavoriteGames: jest.fn(),
        favoriteGames: [1, 2, 3],
        offerGames: [1, 2, 3, 4, 5],
        enabledQuickBet: true,
        updateEnabledQuickBet: jest.fn(),
        isShowBoostedOdds: false,
        promotionNotifications: [] as [],
        isShowToolbarGuide: false,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        // Setup default mocks
        const { getAppSettings } = require("../../common/app-settings");
        getAppSettings.mockReturnValue({ appType: 2 }); // mobile
        
        const { getLocalStorageItem } = require("../../common/local-storage");
        getLocalStorageItem.mockReturnValue("VG");
    });

    describe("Header Component", () => {
        test("renders Header component correctly", () => {
            render(<Header {...defaultProps} />);
            
            expect(screen.getByTestId("header")).toBeInTheDocument();
            expect(screen.getByTestId("settings")).toBeInTheDocument();
            expect(screen.getByTestId("user-info")).toBeInTheDocument();
        });

        test("renders logo with correct src", () => {
            render(<Header {...defaultProps} />);
            
            const logo = screen.getByAltText("UM");
            expect(logo).toHaveAttribute("src", "/static/images/logo-desktop-vgaming.svg?v=1.0.0");
        });

        test("passes correct props to Settings component", () => {
            const { Settings } = require("../shared/settings");
            
            render(<Header {...defaultProps} />);
            
            expect(Settings).toHaveBeenCalledWith(
                expect.objectContaining({
                    enabledSound: true,
                    enabledNotification: true,
                    favoriteGames: [1, 2, 3],
                    offerGames: [1, 2, 3, 4, 5],
                    enabledQuickBet: true,
                    isShowBoostedOdds: false,
                    promotionNotifications: [],
                    isShowToolbarGuide: false,
                }),
                expect.anything()
            );
        });

        test("passes user prop to UserInfo component", () => {
            const { UserInfo } = require("../user-info");
            
            render(<Header {...defaultProps} />);
            
            expect(UserInfo).toHaveBeenCalledWith(
                { user: mockUser },
                expect.anything()
            );
        });
    });

    describe("getLogoName function", () => {
        const { getAppSettings } = require("../../common/app-settings");
        const { isL1System } = require("../../common/constants");

        beforeEach(() => {
            jest.clearAllMocks();
        });

        test("returns 'saba-mega-keno' for L1 Mega Keno", () => {
            getAppSettings.mockReturnValue({ appType: 4 }); // megaKeno
            isL1System.mockReturnValue(true);
            
            const result = getLogoName("VG");
            
            expect(result).toBe("saba-mega-keno");
        });

        test("returns 'sabaplay-keno' for SP Mega Keno", () => {
            getAppSettings.mockReturnValue({ appType: 4 }); // megaKeno
            isL1System.mockReturnValue(false);
            
            const result = getLogoName("SP");
            
            expect(result).toBe("sabaplay-keno");
        });

        test("returns 'vgaming-keno' for VG Mega Keno", () => {
            getAppSettings.mockReturnValue({ appType: 4 }); // megaKeno
            isL1System.mockReturnValue(false);
            
            const result = getLogoName("VG");
            
            expect(result).toBe("vgaming-keno");
        });

        test("returns 'saba' for L1 regular app", () => {
            getAppSettings.mockReturnValue({ appType: 2 }); // mobile
            isL1System.mockReturnValue(true);
            
            const result = getLogoName("VG");
            
            expect(result).toBe("saba");
        });

        test("returns 'sabaplay' for SP regular app", () => {
            getAppSettings.mockReturnValue({ appType: 2 }); // mobile
            isL1System.mockReturnValue(false);
            
            const result = getLogoName("SP");
            
            expect(result).toBe("sabaplay");
        });

        test("returns 'vgaming' for VG regular app (default)", () => {
            getAppSettings.mockReturnValue({ appType: 2 }); // mobile
            isL1System.mockReturnValue(false);
            
            const result = getLogoName("VG");
            
            expect(result).toBe("vgaming");
        });

        test("uses default operator 'VG' when no operator provided", () => {
            getAppSettings.mockReturnValue({ appType: 2 }); // mobile
            isL1System.mockReturnValue(false);
            
            const result = getLogoName();
            
            expect(result).toBe("vgaming");
        });
    });
});
