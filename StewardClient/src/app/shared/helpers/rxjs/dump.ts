import { MonoTypeOperatorFunction, Observable, tap } from 'rxjs';

/** Utility for debugging pipes via console logging. */
export function dump<T>(message: unknown, optionalParams?: object): MonoTypeOperatorFunction<T> {
  return (source: Observable<T>) => {
    return source.pipe(
      // eslint-disable-next-line no-console
      tap(v => console.log(`rxjs| ${message}`, { rxjsValue: v, ...optionalParams })),
    );
  };
}
