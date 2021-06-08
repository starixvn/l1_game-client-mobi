export default {
    moduleFileExtensions: ["ts", "tsx", "js"],
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    testMatch: ["**/*.(test|spec).(ts|tsx)"],
    globals: {
        "ts-jest": {
            babelConfig: {
                plugins: ["@babel/plugin-proposal-optional-chaining", "@babel/plugin-proposal-nullish-coalescing-operator"],
            },
            tsConfig: "jest.tsconfig.json",
            diagnostics: false,
        },
    },
    coveragePathIgnorePatterns: ["/node_modules/", "enzyme.js"],
    setupTestFrameworkScriptFile: "<rootDir>/enzyme.js",
    coverageReporters: ["json", "lcov", "text", "text-summary"],
    moduleNameMapper: {
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/mocks.js",
        "\\.(css|less|scss)$": "<rootDir>/__mocks__/mocks.js",
    },
    snapshotSerializers: ["enzyme-to-json/serializer"],
};
