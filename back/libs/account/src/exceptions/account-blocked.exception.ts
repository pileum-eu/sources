/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { AccountBaseException } from './account-base.exception';

@Description(
  'Un utilisateur a demandé à ce que sa connexion via FranceConnect soit désactivée. La connexion via ses identifiants est donc impossible désormais. Réactivation du compte nécessaire pour pouvoir procéder à une nouvelle connexion via ce compte.',
)
export class AccountBlockedException extends AccountBaseException {
  code = ErrorCode.ACCOUNT_BLOCKED;
  message =
    'Votre accès a été désactivé. Pour le réactiver merci de nous contacter.';
  public readonly httpStatusCode = HttpStatus.FORBIDDEN;
}
