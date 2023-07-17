import { Pipe, PipeTransform } from '@angular/core';
import { BigJsonPipe } from './big-json.pipe';

/** An impure version of the json pipe which recalculates the stringified value constantly. */
@Pipe({
  name: 'impureBigjson',
  pure: false,
})
export class ImpureBigJsonPipe extends BigJsonPipe implements PipeTransform {}
