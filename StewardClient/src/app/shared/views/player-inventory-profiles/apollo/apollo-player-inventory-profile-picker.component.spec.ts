import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatChipsModule } from '@angular/material/chips';
import { ApolloPlayersIdentitiesFakeApi } from '@interceptors/fake-api/apis/title/apollo/players/identities';
import { fakeXuid } from '@interceptors/fake-api/utility';
import { ApolloService, createMockApolloService, MockApolloService } from '@services/apollo';
import { first } from 'lodash';
import { baseTests } from '../player-inventory-profiles-picker/player-inventory-profile-picker.base.component.spec';

import { ApolloPlayerInventoryProfilePickerComponent } from './apollo-player-inventory-profile-picker.component';

describe('ApolloPlayerInventoryProfilePickerComponent', () => {
  let fixture: ComponentFixture<ApolloPlayerInventoryProfilePickerComponent>;
  let service: MockApolloService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApolloPlayerInventoryProfilePickerComponent],
      providers: [createMockApolloService()],
      imports: [MatChipsModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    service = (TestBed.inject(ApolloService) as unknown) as MockApolloService;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApolloPlayerInventoryProfilePickerComponent);
    fixture.detectChanges();
  });

  baseTests(
    () => fixture,
    () => first(ApolloPlayersIdentitiesFakeApi.make([{ xuid: fakeXuid() }])),
    () => new MockApolloService().getPlayerInventoryProfilesByXuid$,
    fn => (service.getPlayerInventoryProfilesByXuid$ = fn),
  );
});
