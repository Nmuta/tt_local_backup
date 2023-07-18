import { StewardErrorCode } from './enums';

/** Interface for a gifting response. */
export interface StewardError {
  code: StewardErrorCode;
  message: string;
  innerException?: unknown;
}
