import { Injectable, Provider } from '@angular/core';
import { ApolloGiftingLspGroupFakeApi } from '@interceptors/fake-api/apis/title/apollo/gifting/groupId';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { ApolloGiftingService } from './apollo-gifting.service';

/** Defines the mock for the API Service. */
@Injectable()
export class MockApolloGiftingService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public postGiftLiveryToPlayersUsingBackgroundJob$ = jasmine
    .createSpy('postGiftLiveryToPlayersUsingBackgroundJob')
    .and.returnValue(of('fake-job-id'));

  public postGiftLiveryToLspGroup$ = jasmine
    .createSpy('postGiftLiveryToLspGroup')
    .and.callFake(() =>
      this.waitUntil$.pipe(switchMap(() => of(ApolloGiftingLspGroupFakeApi.make()))),
    );
}
/** Creates an injectable mock for Apollo Service. */
export function createMockApolloGiftingService(): Provider {
  return {
    provide: ApolloGiftingService,
    useValue: new MockApolloGiftingService(),
  };
}
