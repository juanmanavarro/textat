import { Module } from '@nestjs/common';
import { CrypterService } from './services/crypter.service';
import { LogsService } from './services/logs.service';
import { TimezoneService } from './services/timezone.service';

@Module({
  providers: [
    CrypterService,
    LogsService,
    TimezoneService,
  ],
  exports: [
    CrypterService,
    LogsService,
  ],
})
export class SharedModule {}
