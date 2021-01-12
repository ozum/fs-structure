module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: [
    "<rootDir>/dist/",
    "<rootDir>/node_modules/",
    "<rootDir>/node_modules.nosync/",
    "/test-helper/",
    "/__test__/",
    "<rootDir>/.eslintrc.js",
  ],
  modulePathIgnorePatterns: ["<rootDir>/node_modules.nosync/"],
};
