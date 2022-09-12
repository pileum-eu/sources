module.exports = {
  collectCoverageFrom: [
    'apps/**/*.@(ts|tsx)',
    'libs/**/*.@(ts|tsx)',
    'instances/**/*.@(ts|tsx)',
    '!**/*.d.ts',
    '!**/setupTests.ts',
    '!**/setupProxy.ts',
    '!**/__fixtures__/*',
    '!**/__mocks__/*',
    '!tests-utils/*',
    '!.storybook/*',
    '!**/*.stories.tsx',
  ],
  coverageDirectory: './coverage',
  moduleNameMapper: {
    // @NOTE LIBS Modules are arranged in alphabetical order
    '^@fc/account(|/.*)$': '<rootDir>/libs/account/src/$1',
    '^@fc/agent-connect-history(|/.*)$': '<rootDir>/apps/agent-connect-history/src/$1',
    '^@fc/agent-connect-search(|/.*)$': '<rootDir>/apps/agent-connect-search/src/$1',
    '^@fc/axios-error-catcher(|/.*)$': '<rootDir>/libs/axios-error-catcher/src/$1',
    '^@fc/backoffice(|/.*)$': '<rootDir>/libs/backoffice/src/$1',
    '^@fc/common(|/.*)$': '<rootDir>/libs/common/src/$1',
    '^@fc/config(|/.*)$': '<rootDir>/libs/config/src/$1',
    '^@fc/dsfr(|/.*)$': '<rootDir>/libs/dsfr/src/$1',
    '^@fc/error-boundary(|/.*)$': '<rootDir>/libs/error-boundary/src/$1',
    '^@fc/http-client(|/.*)$': '<rootDir>/libs/http-client/src/$1',
    '^@fc/i18n(|/.*)$': '<rootDir>/libs/i18n/src/$1',
    '^@fc/loading(|/.*)$': '<rootDir>/libs/loading/src/$1',
    '^@fc/partners(|/.*)$': '<rootDir>/apps/partners/src/$1',
    '^@fc/oidc-client(|/.*)$': '<rootDir>/libs/oidc-client/src/$1',
    '^@fc/routing(|/.*)$': '<rootDir>/libs/routing/src/$1',
    '^@fc/service-providers(|/.*)$': '<rootDir>/apps/service-providers/src/$1',
    '^@fc/state-management(|/.*)$': '<rootDir>/libs/state-management/src/$1',
    '^@fc/tracks(|/.*)$': '<rootDir>/apps/tracks/src/$1',
    '^@fc/user-preferences(|/.*)$': '<rootDir>/apps/user-preferences/src/$1',
    /**
     * Custom test wrappers
     */
    '^@fc/tests-utils(|/.*)$': '<rootDir>/tests-utils/src/$1',
    /**
     * Mock images and SCSS import as jest does not have the "magic" webpack has
     * to handle raw imports of those files in components definitions and would crash
     * while attempting to interpret such import as javascript or typescript.
     * @see https://create-react-app.dev/docs/adding-a-stylesheet/
     * @see https://jestjs.io/docs/webpack#mocking-css-modules
     */
     '\\.(css|scss)$': 'identity-obj-proxy',
     '\\.svg$': '<rootDir>/__mocks__/svgrMock.js',
  },
  preset: 'ts-jest',
  roots: ['<rootDir>/apps/', '<rootDir>/instances/', '<rootDir>/libs/'],
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['/node_modules/', '/cypress/'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
};
