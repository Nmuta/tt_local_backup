import { UgcType } from '@models/ugc-filters';

export interface ShareCodeOutputModel {
  shareCodeOrId: string;
  fm8: UgcType[];
  fh5: UgcType[];
  fh4: UgcType[];
}
