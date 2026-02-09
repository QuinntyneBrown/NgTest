const { createCjsPreset } = require('jest-preset-angular/presets');

const presetConfig = createCjsPreset({
  tsconfig: '<rootDir>/tsconfig.spec.json',
});

/** @type {import('jest').Config} */
module.exports = {
  displayName: 'playground',
  ...presetConfig,
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    ...presetConfig.moduleNameMapper,
    'sample-lib': '<rootDir>/projects/sample-lib/src/public-api.ts',
  },
};
