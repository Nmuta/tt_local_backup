import { JsonPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

/** An impure version of the json pipe which recalculates the stringified value constantly. */
@Pipe({
  name: 'impureJson',
  pure: false,
})
export class ImpureJsonPipe extends JsonPipe implements PipeTransform {}
