import { FormControl, ValidationErrors } from '@angular/forms';
import { STANDARD_BAN_REASONS } from '@tools-app/pages/user-banning/components/ban-options/ban-options.component';
import _ from 'lodash';

export function requireReasonListMatch(control: FormControl): ValidationErrors | null {
  const selection = control.value;
  const banReasons = [].concat(
    ...STANDARD_BAN_REASONS.map(g => {
      return g.values;
    }),
  );

  if (!_.includes(banReasons, selection)) {
    return { requireReasonListMatch: true };
  }

  return null;
}
