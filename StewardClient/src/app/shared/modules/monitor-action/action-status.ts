import { DateTime } from 'luxon';

/** The mode this status was created under. @see ActionMonitor */
export type ActionStatusMode = 'single-fire' | 'multi-fire';

/**
 * A state snapshot of a long-running observable.
 *
 * - **Inactive**: The observable is alive but there is no pending operation.
 * - **Inactive Error**: The observable is alive, there is no pending operation, and the last operation ended in an error (which was suppressed).
 * - **Active**: There is a pending operation.
 * - **Complete**: The observable has completed successfully.
 * - **Error**: The observable has completed with an error.
 *
 * Flow:
 * - Inactive -> Active (multi-fire only)
 * - Active -> Inactive (multi-fire only)
 * - Active -> Complete
 * - Active -> Error
 */
export type ActionStatusState = 'inactive' | 'active' | 'complete' | 'error' | 'inactive-error';

export interface ActionStatus<T> {
  value: T;
  state: ActionStatusState;
  error: unknown;
  dates: {
    lastStart: DateTime;
    lastEnd: DateTime;
  };
  mode: ActionStatusMode;
}
