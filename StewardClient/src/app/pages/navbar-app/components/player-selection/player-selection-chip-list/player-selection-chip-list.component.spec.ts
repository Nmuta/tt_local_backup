import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApolloPlayersIdentitiesFakeApi } from '@interceptors/fake-api/apis/title/apollo/players/identities';
import { fakeXuid } from '@interceptors/fake-api/utility';
import { IdentityQueryAlpha } from '@models/identity-query.model';

import { PlayerSelectionChipListComponent } from './player-selection-chip-list.component';

describe('PlayerSelectionChipListComponent', () => {
  let component: PlayerSelectionChipListComponent;
  let fixture: ComponentFixture<PlayerSelectionChipListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlayerSelectionChipListComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerSelectionChipListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should augment identities', () => {
    const fakeXuids = [fakeXuid(), fakeXuid(), fakeXuid()];
    const fakeIdentityQueries = fakeXuids.map(xuid => <IdentityQueryAlpha> { xuid: xuid });
    component.identities = ApolloPlayersIdentitiesFakeApi.make(fakeIdentityQueries);
    fixture.detectChanges();

    expect(component.augmentedIdentities).toBeDefined();
    expect(component.augmentedIdentities.length).toBe(fakeXuids.length);
    component.augmentedIdentities.forEach(ai => expect(ai.extra).toBeDefined());
  });
});
