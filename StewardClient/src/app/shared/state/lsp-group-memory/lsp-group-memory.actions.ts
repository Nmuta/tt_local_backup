import { GameTitleCodeName } from '@models/enums';

/** Gets the given title's lsp groups. */
export class GetLspGroups {
  public static readonly type = '[TitleMemory] Get Lsp Groups';
  constructor(
    public readonly title: GameTitleCodeName,
  ) {}
}
