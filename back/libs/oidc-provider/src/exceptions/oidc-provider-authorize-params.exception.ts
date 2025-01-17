/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { OidcProviderBaseException } from './oidc-provider-base.exception';

@Description(
  "Un ou plusieurs `params` de la route `authorize` n'a/ont pas été validé par le DTO",
)
export class OidcProviderAuthorizeParamsException extends OidcProviderBaseException {
  public readonly code = ErrorCode.AUTHORIZATION_ERROR;
  public readonly httpStatusCode = HttpStatus.BAD_REQUEST;

  constructor() {
    super(
      'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous.',
    );
  }
}
