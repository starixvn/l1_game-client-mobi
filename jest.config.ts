export default {
    coverageDirectory: "coverage",
    moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx"],
    roots: ["<rootDir>"],
    testEnvironment: "node",
    testPathIgnorePatterns: ["<rootDir>[/\\\\](node_modules|.next)[/\\\\]"],
    transform: {
        "^.+\\.tsx?$": "babel-jest",
    },
    transformIgnorePatterns: ["[/\\\\]node_modules[/\\\\].+\\.(ts|tsx)$", "enzyme.js"],
    setupFilesAfterEnv: ["<rootDir>/enzyme.js"],
    moduleNameMapper: {
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/mocks.js",
        "\\.(css|less|scss)$": "<rootDir>/__mocks__/mocks.js",
    },
};
