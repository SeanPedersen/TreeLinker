/** @type {import('jest').Config} */
module.exports = {
    testEnvironment: 'node',
    transform: { '\\.(mjs|jsx|js|ts|tsx)$': 'ts-jest' },
    moduleDirectories: ['node_modules', 'src'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'mjs'],
    setupFilesAfterSetup: ['./jest.setup.js'],
    moduleNameMapper: {
        '\\.(css|less|scss)$': 'identity-obj-proxy',
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    transformIgnorePatterns: [
        '<rootDir>/node_modules/(?!(' +
            '@garinz/webext-bridge' +
            '|.pnpm/nanoevents@6.0.2/node_modules/nanoevents' +
            '|.pnpm/serialize-error@9.1.1/node_modules/serialize-error' +
            '|.pnpm/dexie@3.2.3/node_modules/dexie' +
            '))',
    ],
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
    coverageDirectory: 'coverage',
};
