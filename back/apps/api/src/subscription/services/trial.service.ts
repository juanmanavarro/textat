import { Injectable } from '@nestjs/common';
import { DateService } from '@shared/services/date.service';

@Injectable()
export class TrialService {
  static trialEnd(registeredAt: Date): Date {
    const trialEnd = DateService.dayjs(registeredAt)
      .add(Number(process.env.TRIAL_DAYS), 'days')
      .toDate();

    return DateService.isFuture(trialEnd) ? trialEnd : undefined;
  }
}
