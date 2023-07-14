import { GameTitleCodeName } from '@models/enums';
import { TitleMemoryModel } from './title-memory.model';

/** Updates the last remembered title for a given tool. */
export class UpdateTitleMemory {
  public static readonly type = '[TitleMemory] Update Last Title';
  constructor(
    public readonly tool: keyof TitleMemoryModel,
    public readonly title: GameTitleCodeName,
  ) {}
}
