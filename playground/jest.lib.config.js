const { createCjsPreset } = require('jest-preset-angular/presets');

const presetConfig = createCjsPreset({
  tsconfig: '<rootDir>/projects/sample-lib/tsconfig.spec.json',
});

/** @type {import('jest').Config} */
module.exports = {
  displayName: 'sample-lib',
  ...presetConfig,
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  roots: ['<rootDir>/projects/sample-lib'],
};
