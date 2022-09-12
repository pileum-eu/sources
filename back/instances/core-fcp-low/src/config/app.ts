/* istanbul ignore file */

// Tested by DTO
import { AppConfig } from '@fc/app';
import { ConfigParser } from '@fc/config';

const env = new ConfigParser(process.env, 'App');

export default {
  apiOutputContentType: env.string('API_OUTPUT_CONTENT_TYPE'),
  name: 'FC_CORE_LOW',
  urlPrefix: '/api/v2',
  assetsPaths: env.json('ASSETS_PATHS'),
  viewsPaths: env.json('VIEWS_PATHS'),
  httpsOptions: {
    key: env.file('HTTPS_SERVER_KEY', { optional: true }),
    cert: env.file('HTTPS_SERVER_CERT', { optional: true }),
  },
  fqdn: process.env.FQDN,
  // @NOTE a-t-on besoin de cette variable pour fcp low ?
  udFqdn: process.env.UD_FQDN,
} as AppConfig;
