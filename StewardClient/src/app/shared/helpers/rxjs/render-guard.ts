import { timer } from 'rxjs';

/** Ensures the given action occurs between render steps, thus avoiding Angular's "changed after checked" errors */
export function renderGuard(action: () => void): void {
  timer(0).subscribe(() => action());
}
