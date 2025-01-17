import { Injectable } from '@nestjs/common';

import { CoreAccountService, CoreAcrService } from '@fc/core';
import { CryptographyEidasService } from '@fc/cryptography-eidas';
import { FeatureHandler } from '@fc/feature-handler';
import { LoggerService } from '@fc/logger-legacy';
import { IOidcIdentity } from '@fc/oidc';
import { ServiceProviderAdapterMongoService } from '@fc/service-provider-adapter-mongo';

import {
  IVerifyFeatureHandler,
  IVerifyFeatureHandlerHandleArgument,
} from '../../interfaces';

@Injectable()
@FeatureHandler('core-fcp-eidas-verify')
export class CoreFcpEidasVerifyHandler implements IVerifyFeatureHandler {
  // Dependency injection can require more than 4 parameters
  /* eslint-disable-next-line max-params */
  constructor(
    private readonly logger: LoggerService,
    private readonly coreAcount: CoreAccountService,
    private readonly coreAcr: CoreAcrService,
    private readonly serviceProvider: ServiceProviderAdapterMongoService,
    private readonly cryptographyEidas: CryptographyEidasService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async handle({
    sessionOidc,
  }: IVerifyFeatureHandlerHandleArgument): Promise<void> {
    this.logger.debug('getConsent service: ##### core-fcp-eidas-verify ');

    // Grab informations on interaction and identity
    const { idpIdentity, idpAcr, spId, spAcr, subs } = await sessionOidc.get();
    const { entityId } = await this.serviceProvider.getById(spId);

    // Acr check
    this.coreAcr.checkIfAcrIsValid(idpAcr, spAcr);

    const identityHash = this.cryptographyEidas.computeIdentityHash(
      idpIdentity as IOidcIdentity,
    );
    const sub = this.cryptographyEidas.computeSubV1(entityId, identityHash);

    // Save interaction to database
    const accountId = await this.coreAcount.computeFederation({
      key: entityId,
      sub,
      identityHash,
    });

    /**
     * Prepare identity that will be retrieved by `oidc-provider`
     * and sent to the SP
     *
     * We need to replace IdP's sub, by our own sub
     */
    const { sub: _sub, ...spIdentityCleaned } = idpIdentity;

    // Delete idp identity from volatile memory but keep the sub for the business logs.
    const idpIdentityCleaned = { sub: idpIdentity.sub };

    await sessionOidc.set({
      amr: ['eidas'],
      idpIdentity: idpIdentityCleaned,
      spIdentity: spIdentityCleaned,
      accountId,
      subs: { ...subs, [spId]: sub },
    });
  }
}
