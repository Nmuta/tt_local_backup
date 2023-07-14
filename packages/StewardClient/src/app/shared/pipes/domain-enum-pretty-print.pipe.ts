import { Pipe, PipeTransform } from '@angular/core';
import { DeviceType } from '@models/enums';
import { UgcOrderBy } from '@models/ugc-filters';
import _ from 'lodash';

export interface EnumPrintMap {
  enum: string;
  output: string;
}

/**
 * A pipe to display enum values with special characters / display requirements.
 */
@Pipe({
  name: 'depp',
})
export class DomainEnumPrettyPrintPipe implements PipeTransform {
  /** The transform hook. */
  public transform(value: string): string {
    if (!_.isString(value)) {
      return value;
    }

    switch (value) {
      case DeviceType.XboxSeriesXS:
        return 'Xbox Series X|S';
        break;

      case DeviceType.XboxCloud:
        return 'XCloud';
        break;

      case UgcOrderBy.CreatedDateAsc:
        return 'Oldest first';
        break;

      case UgcOrderBy.CreatedDateDesc:
        return 'Newest first';
        break;

      case UgcOrderBy.PopularityScoreAsc:
        return 'Least Popular First';
        break;

      case UgcOrderBy.PopularityScoreDesc:
        return 'Most Popular First';
        break;

      default:
        return value;
    }
  }
}
