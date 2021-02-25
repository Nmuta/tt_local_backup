import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApolloPlayersIdentitiesFakeApi } from '@interceptors/fake-api/apis/title/apollo/players/identities';
import { fakeXuid } from '@interceptors/fake-api/utility';
import { IdentityResultUnion } from '@models/identity-query.model';
import { PlayerSelectionBaseComponent } from '../player-selection.base.component';

import { PlayerSelectionChipComponent } from './player-selection-chip.component';

describe('PlayerSelectionChipComponent', () => {
  let component: PlayerSelectionChipComponent;
  let fixture: ComponentFixture<PlayerSelectionChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlayerSelectionChipComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerSelectionChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('with good identity', () => {
    beforeEach(() => {
      component.identity = ApolloPlayersIdentitiesFakeApi.make([{ xuid: fakeXuid() }])[0];
      component.playerSelection = ({
        playerIdType: 'xuid',
      } as unknown) as PlayerSelectionBaseComponent<IdentityResultUnion>;
      component.ngOnChanges(undefined);
    });

    it('should calculate correctly', () => {
      expect(component.name.toString()).toBe(component.identity.xuid.toString());
      expect(component.nameTooltip.toString()).toBe(component.identity.xuid.toString());
      expect(component.theme).toBe('primary');
      expect();
    });
  });

  describe('with bad identity', () => {
    beforeEach(() => {
      component.identity = ApolloPlayersIdentitiesFakeApi.make([{ xuid: fakeXuid() }])[0];
      component.identity.error = {
        code: 'test code',
        details: null,
        innererror: null,
        message: 'test message',
        target: null,
      };
      component.playerSelection = ({
        playerIdType: 'xuid',
      } as unknown) as PlayerSelectionBaseComponent<IdentityResultUnion>;
      component.ngOnChanges(undefined);
    });

    it('should calculate correctly', () => {
      expect(component.name.toString()).toBe(component.identity.xuid.toString());
      expect(component.nameTooltip).toContain('invalid');
      expect(component.theme).toBe('warn');
      expect();
    });
  });
});
