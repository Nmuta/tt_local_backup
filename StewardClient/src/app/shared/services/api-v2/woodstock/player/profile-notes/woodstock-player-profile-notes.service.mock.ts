import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { WoodstockPlayerProfileNotesService } from './woodstock-player-profile-notes.service';

/** Defines the mock for the API Service. */
export class MockWoodstockPlayerProfileNotesService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getProfileNotesByXuid$ = jasmine
    .createSpy('getProfileNotesByXuid$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of())));

  public addProfileNoteByXuid$ = jasmine
    .createSpy('addProfileNoteByXuid$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of())));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Woodstock Profile Note Service. */
export function createMockWoodstockPlayerProfileNotesService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: WoodstockPlayerProfileNotesService,
    useValue: new MockWoodstockPlayerProfileNotesService(returnValueGenerator),
  };
}
