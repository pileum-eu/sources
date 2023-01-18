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
    specPattern: 'cypress/integration/dashboard/*.feature',
    supportFile: 'cypress/support/index.ts',
    video: false,
  },
  env: {
    // Base Configuration
    BASE_URLS: {
      recette: 'https://recette.dev-franceconnect.fr',
    },
    PLATFORM: 'fcp-legacy',
    TEST_ENV: 'docker',
    TAGS: '@userDashboard and not @ignore',
    // Test environment access
    EXPLOIT_ADMIN_NAME: 'jean_moust',
    EXPLOIT_ADMIN_PASS: 'georgesmoustaki',
    EXPLOIT_ADMIN_TOTP: 'KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD',
    EXPLOIT_USER_NAME: 'jean_patoche',
    EXPLOIT_USER_PASS: 'georgesmoustaki',
    EXPLOIT_USER_TOTP: 'KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD',
    SUPPORT_USER_NAME: 'jean_patoche',
    SUPPORT_USER_PASS: 'georgesmoustaki',
    SUPPORT_USER_TOTP: 'KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD',
    FC_ACCESS_USER: '',
    FC_ACCESS_PASS: '',
    // Other Configuration
    Elasticsearch_TRACKS_INDEX: "fc_tracks",
    Elasticsearch_NODES: "[\"http://elasticsearch:9200\",\"https://elasticsearch:9200\"]",
    Elasticsearch_USERNAME: "docker-stack",
    Elasticsearch_PASSWORD: "docker-stack",
    MAILDEV_PROTOCOL: "https",
    MAILDEV_HOST: "maildev.docker.dev-franceconnect.fr",
    MAILDEV_SMTP_PORT: "1025",
    MAILDEV_API_PORT: "443",
    LOG_FILE_PATH: '../../../fc-docker/volumes/log/event.log',
  },
});