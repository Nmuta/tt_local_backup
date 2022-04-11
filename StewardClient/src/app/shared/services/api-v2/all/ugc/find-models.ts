import { UgcType } from '@models/ugc-filters';

export interface ShareCodeOutputModel {
  shareCodeOrId: string;
  fh5: UgcType[];
  fh4: UgcType[];
}
