import { Injectable } from '@nestjs/common';
import * as cityTimezones from 'city-timezones';
import { getLocalInfo } from 'phone-number-to-timezone';

@Injectable()
export class TimezoneService {
  static fromCity(city: string): string {
    return cityTimezones.lookupViaCity(city)[0].timezone;
  }

  static fromPhone(phone: string): string {
    const countryInfo = getLocalInfo(`+${phone}`, { zone_display: 'offset' });
    const zones = cityTimezones.lookupViaCity(countryInfo.country_info.capital);
    return zones.length
      ? zones[0].timezone
      : 'Etc/GMT';
  }
}
