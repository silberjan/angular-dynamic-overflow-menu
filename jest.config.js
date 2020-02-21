module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  moduleDirectories: ['node_modules', '.'],
  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.spec.json',
      stringifyContentPathRegex: '\\.html$',
      astTransformers: ['jest-preset-angular/InlineHtmlStripStylesTransformer.js'],
    },
  },
  transform: {
    '^.+\\.(ts|js|html)$': 'ts-jest',
  },
  verbose: false,
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!ngx-cookie-service|@targomo/tamil)'],
  collectCoverageFrom: ['src/**/*.{ts,js}', '!**/node_modules/**'],
  coveragePathIgnorePatterns: [
    '.module.ts',
    '<rootDir>/src/main.ts',
    '<rootDir>/src/polyfills.ts',
    '<rootDir>/src/mocks',
    '.mock.ts',
  ],
}
