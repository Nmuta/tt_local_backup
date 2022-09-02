import { delay, MonoTypeOperatorFunction, timer } from 'rxjs';

/** Ensures the given action occurs between render steps, thus avoiding Angular's "changed after checked" errors */
export function renderGuard(action: () => void): void {
  timer(0).subscribe(() => action());
}

/** Provides a delay that ensures the following actions happen between render steps. */
export function renderDelay<T>(): MonoTypeOperatorFunction<T> {
  return delay(0);
}
