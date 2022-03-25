/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';

import { AccountModule } from '@fc/account';
import { CryptographyFcpModule } from '@fc/cryptography-fcp';
import { ExceptionsModule } from '@fc/exceptions';
import { IdentityProviderAdapterMongoModule } from '@fc/identity-provider-adapter-mongo';
import { LoggerModule } from '@fc/logger';
import { MailerModule } from '@fc/mailer';
import { MongooseModule } from '@fc/mongoose';

import { CsmrUserPreferencesController } from './controllers';
import { CsmrUserPreferenceHandler } from './handlers';
import { CsmrUserPreferencesService } from './services';

@Module({
  imports: [
    ExceptionsModule,
    MongooseModule,
    LoggerModule,
    AccountModule,
    CryptographyFcpModule,
    IdentityProviderAdapterMongoModule,
    MailerModule,
  ],
  controllers: [CsmrUserPreferencesController],
  providers: [CsmrUserPreferencesService, CsmrUserPreferenceHandler],
  exports: [CsmrUserPreferenceHandler],
})
export class CsmrUserPreferencesModule {}
