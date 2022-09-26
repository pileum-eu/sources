import { encode } from 'querystring';

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Redirect,
  Render,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { AppConfig } from '@fc/app';
import { ConfigService } from '@fc/config';
import { IdentityProviderAdapterEnvService } from '@fc/identity-provider-adapter-env';
import { LoggerLevelNames, LoggerService } from '@fc/logger-legacy';
import { OidcSession } from '@fc/oidc';
import {
  GetOidcCallback,
  OidcClientConfig,
  OidcClientRoutes,
  OidcClientService,
  OidcClientSession,
  RedirectToIdp,
} from '@fc/oidc-client';
import {
  ISessionService,
  Session,
  SessionCsrfService,
  SessionInvalidCsrfSelectIdpException,
  SessionNotFoundException,
  SessionService,
} from '@fc/session';

import { AccessTokenParamsDTO } from '../dto';
import { UserDashboardBackRoutes, UserDashboardFrontRoutes } from '../enums';
import { UserDashboardTokenRevocationException } from '../exceptions';

@Controller()
export class OidcClientController {
  // eslint-disable-next-line max-params
  constructor(
    private readonly logger: LoggerService,
    private readonly oidcClient: OidcClientService,
    private readonly identityProvider: IdentityProviderAdapterEnvService,
    private readonly csrfService: SessionCsrfService,
    private readonly config: ConfigService,
    private readonly sessionService: SessionService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  /**
   * @todo #242 get configured parameters (scope and acr)
   */
  @Post(OidcClientRoutes.REDIRECT_TO_IDP)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async redirectToIdp(
    @Res() res,
    @Body() body: RedirectToIdp,
    /**
     * @todo #1020 Partage d'une session entre oidc-provider & oidc-client
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1020
     * @ticket FC-1020
     */
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ): Promise<void> {
    // acr_values is an oidc defined variable name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { acr: acr_values, scope } =
      this.config.get<OidcClientConfig>('OidcClient');
    const { csrfToken } = body;

    const PROVIDER_UID = 'envIssuer';

    // -- control if the CSRF provided is the same as the one previously saved in session.
    try {
      await this.csrfService.validate(sessionOidc, csrfToken);
    } catch (error) {
      this.logger.trace({ error }, LoggerLevelNames.WARN);
      throw new SessionInvalidCsrfSelectIdpException(error);
    }

    const { nonce, state } =
      await this.oidcClient.utils.buildAuthorizeParameters();

    const authorizationUrl = await this.oidcClient.utils.getAuthorizeUrl({
      // acr_values is an oidc defined variable name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values,
      nonce,
      idpId: PROVIDER_UID,
      scope,
      state,
    });

    const { name: idpName, title: idpLabel } =
      await this.identityProvider.getById(PROVIDER_UID);
    const session: OidcClientSession = {
      idpId: PROVIDER_UID,
      idpName,
      idpLabel,
      idpNonce: nonce,
      idpState: state,
    };

    await sessionOidc.set(session);

    this.logger.trace({
      body,
      method: 'POST',
      name: 'OidcClientRoutes.REDIRECT_TO_IDP',
      redirect: authorizationUrl,
      res,
      route: OidcClientRoutes.REDIRECT_TO_IDP,
      session,
    });

    res.redirect(authorizationUrl);
  }

  /**
   * @TODO #141 implement proper well-known
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/141
   *  - generated by openid-client
   *  - pub keys orverrided by keys from HSM
   */
  @Get(OidcClientRoutes.WELL_KNOWN_KEYS)
  async getWellKnownKeys() {
    this.logger.trace({
      method: 'GET',
      name: 'OidcClientRoutes.WELL_KNOWN_KEYS',
      route: OidcClientRoutes.WELL_KNOWN_KEYS,
    });
    return this.oidcClient.utils.wellKnownKeys();
  }

  @Get(UserDashboardBackRoutes.LOGOUT)
  async logout(
    @Res() res,
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ) {
    const session: OidcSession = await sessionOidc.get();

    if (!session?.idpIdToken) {
      // BUSINESS: Redirect to business page
      const redirect = '/';

      return res.redirect(redirect);
    }

    const { idpIdToken, idpState, idpId } = session;

    const {
      // OIDC style variable name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      client: { post_logout_redirect_uris },
    } = await this.identityProvider.getById('envIssuer');

    const endSessionUrl: string =
      await this.oidcClient.getEndSessionUrlFromProvider(
        idpId,
        idpState,
        idpIdToken,
        // pop() : We only have one URL but the standard implies an array
        post_logout_redirect_uris[0],
      );

    res.redirect(endSessionUrl);
  }

  @Get(UserDashboardBackRoutes.LOGOUT_CALLBACK)
  async logoutCallback(@Req() req, @Res() res) {
    this.logger.trace({
      route: UserDashboardBackRoutes.LOGOUT_CALLBACK,
      method: 'GET',
      name: 'MockServiceProviderRoutes.LOGOUT_CALLBACK',
      redirect: '/',
    });

    // delete oidc session
    await this.sessionService.reset(req, res);

    // BUSINESS: Redirect to business page
    const redirect = '/';

    return res.redirect(redirect);
  }

  @Post(UserDashboardBackRoutes.REVOCATION)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Render('success-revoke-token')
  async revocationToken(@Res() res, @Body() body: AccessTokenParamsDTO) {
    try {
      /**
       * @TODO #251 ETQ Dev, j'utilise une configuration pour savoir si j'utilise FC, AC, EIDAS, et avoir les valeurs de scope et acr en config et non en dur.
       * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/251
       */
      const providerUid = 'core-fcp-high';
      const { accessToken } = body;
      await this.oidcClient.utils.revokeToken(accessToken, providerUid);

      return {
        accessToken,
        titleFront: 'Mock Service Provider - Token révoqué',
      };
    } catch (e) {
      /**
       * @params e.error : error return by panva lib
       * @params e.error_description : error description return by panva lib
       *
       * If exception is not return by panva, we throw our custom class exception
       * when we try to revoke the token : 'MockServiceProviderTokenRevocationException'
       */
      if (e.error && e.error_description) {
        return res.redirect(
          `/error?error=${e.error}&error_description=${e.error_description}`,
        );
      }
      throw new UserDashboardTokenRevocationException();
    }
  }

  @Get(OidcClientRoutes.OIDC_CALLBACK_LEGACY)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Redirect()
  async getLegacyOidcCallback(
    @Query() query,
    @Param() _params: GetOidcCallback,
  ) {
    const { urlPrefix } = this.config.get<AppConfig>('App');
    const queryParams = encode(query);

    const response = {
      statusCode: 302,
      url: `${urlPrefix}${OidcClientRoutes.OIDC_CALLBACK}?${queryParams}`,
    };

    this.logger.trace({
      method: 'GET',
      name: 'OidcClientRoutes.OIDC_CALLBACK_LEGACY',
    });

    return response;
  }

  /**
   * @TODO #308 ETQ DEV je veux éviter que deux appels Http soient réalisés au lieu d'un à la discovery Url dans le cadre d'oidc client
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/308
   */
  @Get(OidcClientRoutes.OIDC_CALLBACK)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async getOidcCallback(
    @Req() req,
    @Res() res,
    /**
     * @todo #1020 Partage d'une session entre oidc-provider & oidc-client
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1020
     * @ticket FC-1020
     */
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ) {
    const session: OidcSession = await sessionOidc.get();

    if (!session) {
      throw new SessionNotFoundException('OidcClient');
    }

    const { idpId, idpNonce: nonce, idpState: state } = session;

    const tokenParams = {
      nonce,
      state,
    };
    const { accessToken, acr, idToken } =
      await this.oidcClient.getTokenFromProvider(idpId, tokenParams, req);

    const userInfoParams = {
      accessToken,
      idpId,
    };

    const identity = await this.oidcClient.getUserInfosFromProvider(
      userInfoParams,
      req,
    );

    /**
     *  @todo
     *    author: Arnaud
     *    date: 19/03/2020
     *    ticket: FC-244 (identity, DTO, Mock, FS)
     *
     *    action: Check the data returns from FC
     */

    const identityExchange: OidcSession = {
      idpAccessToken: accessToken,
      idpAcr: acr,
      idpIdentity: identity,
      idpIdToken: idToken,
    };

    await sessionOidc.set({ ...identityExchange });

    res.redirect(UserDashboardFrontRoutes.MES_TRACES);
  }
}
