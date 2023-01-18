// Disable sort-keys to separate base configuration and access env variables
/* eslint-disable sort-keys-fix/sort-keys-fix, sort-keys */
import { defineConfig } from 'cypress';

import pluginConfig from './cypress/plugins';

export default defineConfig({
  e2e: {
    baseUrl: 'https://docker.dev-franceconnect.fr',
    setupNodeEvents(on, config) {
      return pluginConfig(on, config);
    },
    specPattern: 'cypress/integration/{accessibilité,usager,exploitation}/*.feature',
    supportFile: 'cypress/support/index.ts',
    video: false,
  },
  env: {
    // Base Configuration
    BASE_URLS: {
      recette: 'https://recette.dev-franceconnect.fr',
    },
    PLATFORM: 'fcp-low',
    TEST_ENV: 'docker',
    TAGS: 'not @ignoreLow and not @fcpHigh and not @userDashboard',
    // Test environment access
    EXPLOIT_ADMIN_NAME: 'jean_moust',
    EXPLOIT_ADMIN_PASS: 'georgesmoustaki',
    EXPLOIT_ADMIN_TOTP: 'KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD',
    EXPLOIT_USER_NAME: 'jean_patoche',
    EXPLOIT_USER_PASS: 'georgesmoustaki',
    EXPLOIT_USER_TOTP: 'KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD',
    FC_ACCESS_USER: '',
    FC_ACCESS_PASS: '',
    // Other Configuration
    LOG_FILE_PATH: "../../docker/volumes/log/core-fcp-low.log",
  },
});