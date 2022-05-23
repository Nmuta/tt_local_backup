/** Adds a number of UUIDs to the acknowledged list. */
export class AcknowledgeChangelogUuids {
  public static readonly type = '[Changelog] Acknowledge UUIDs';
  constructor(public readonly uuids: string[]) {}
}

/** Adds a number of UUIDs to the pending list. */
export class AddPendingChangelogUuids {
  public static readonly type = '[Changelog] Add Pending UUIDs';
  constructor(public readonly uuids: string[]) {}
}

/** Acknowledges all pending UUIDs. */
export class AcknowledgeAllPendingChangelogUuids {
  public static readonly type = '[Changelog] Acknowledge All Pending UUIDs';
  constructor() {
    /* empty */
  }
}

/** Marks all UUIDs as Pending. */
export class MarkAllChangelogUuidsAsPending {
  public static readonly type = '[Changelog] Mark All Changelog UUIDs as Pending';
  constructor() {
    /* empty */
  }
}

/** Syncs the changelog. */
export class SyncChangelog {
  public static readonly type = '[Changelog] Sync changelog';
  constructor() {
    /* empty */
  }
}

/** Resets the changelog. */
export class ResetChangelog {
  public static readonly type = '[Changelog] Reset';
  constructor() {
    /* empty */
  }
}

/** Sets the disable automatic popup to the given value. */
export class SetDisableAutomaticPopup {
  public static readonly type = '[Changelog] Set disable automatic popup';
  constructor(public readonly value: boolean) {
    /* empty */
  }
}
