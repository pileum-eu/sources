/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { OidcProviderRoutes } from '@fc/oidc-provider';
import { ISessionCookieOptions, SessionConfig } from '@fc/session';

const env = new ConfigParser(process.env, 'Session');

const cookieOptions: ISessionCookieOptions = {
  signed: true,
  sameSite: 'Lax',
  httpOnly: true,
  secure: true,
  maxAge: 600000, // 10 minutes
  domain: process.env.FQDN,
};

export default {
  encryptionKey: env.string('USERINFO_CRYPT_KEY'),
  prefix: 'MOCK-FIA-SESS:',
  cookieOptions,
  cookieSecrets: env.json('COOKIE_SECRETS'),
  sessionCookieName: 'idp_session_id',
  lifetime: 600, // 10 minutes
  sessionIdLength: 64,
  slidingExpiration: true,
  excludedRoutes: [
    OidcProviderRoutes.JWKS,
    OidcProviderRoutes.OPENID_CONFIGURATION,
  ],
} as SessionConfig;
