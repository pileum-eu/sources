/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { GeoipMaxmindBaseException } from './geoip-maxmind-base.exception';

@Description(`La base de donnée local GeoIP Maxmind n'a pa pu être chargée`)
export class GeoipMaxmindNotFoundException extends GeoipMaxmindBaseException {
  public readonly code = ErrorCode.DATABASE_NOT_FOUND;
  public readonly message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';
}
