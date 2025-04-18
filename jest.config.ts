module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
    "transform": {
        "^.+\\.(t|j)sx?$": ["ts-jest", {
            "tsconfig": "tsconfig.json"
        }]
    }
}