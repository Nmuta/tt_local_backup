import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { faker } from '@interceptors/fake-api/utility';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { AugmentedCompositeIdentity } from '@views/player-selection/player-selection-base.component';

import { WoodstockUGCComponent } from './woodstock-ugc.component';

describe('WoodstockUGCComponent', () => {
  let component: WoodstockUGCComponent;
  let fixture: ComponentFixture<WoodstockUGCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WoodstockUGCComponent],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WoodstockUGCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: onPlayerIdentityChange', () => {
    describe('When identity has woodstock identity', () => {
      const woodstockIdentity: IdentityResultAlpha = { gamertag: faker.random.word(), query: null };
      const identity: AugmentedCompositeIdentity = {
        query: null,
        result: null,
        general: null,
        woodstock: woodstockIdentity,
        steelhead: null,
        sunrise: null,
        gravity: null,
        apollo: null,
        opus: null,
        extra: {
          hasWoodstock: true,
        } as never,
      };

      it('should set component identity to valid identity', () => {
        component.onPlayerIdentityChange(identity);

        expect(component.identity).toEqual(woodstockIdentity);
      });
    });

    describe('When identity does not have a woodstock identity', () => {
      const woodstockIdentity: IdentityResultAlpha = { gamertag: faker.random.word(), query: null };
      const identity: AugmentedCompositeIdentity = {
        query: null,
        result: null,
        general: null,
        woodstock: woodstockIdentity,
        steelhead: null,
        sunrise: null,
        gravity: null,
        apollo: null,
        opus: null,
        extra: {
          hasWoodstock: false,
        } as never,
      };

      it('should set component identity to null', () => {
        component.onPlayerIdentityChange(identity);

        expect(component.identity).toBeNull();
      });
    });
  });

  describe('Method: playerIdentitySelected', () => {
    describe('When identity has woodstock identity', () => {
      const woodstockIdentity: IdentityResultAlpha = { gamertag: faker.random.word(), query: null };
      const identity: AugmentedCompositeIdentity = {
        query: null,
        result: null,
        general: null,
        woodstock: woodstockIdentity,
        steelhead: null,
        sunrise: null,
        gravity: null,
        apollo: null,
        opus: null,
        extra: {
          hasWoodstock: true,
        } as never,
      };

      it('should set component identity to valid identity', () => {
        component.playerIdentitySelected(identity);

        expect(component.selectedPlayer).toEqual(woodstockIdentity);
      });
    });

    describe('When identity does not have a woodstock identity', () => {
      const woodstockIdentity: IdentityResultAlpha = { gamertag: faker.random.word(), query: null };
      const identity: AugmentedCompositeIdentity = {
        query: null,
        result: null,
        general: null,
        woodstock: woodstockIdentity,
        steelhead: null,
        sunrise: null,
        gravity: null,
        apollo: null,
        opus: null,
        extra: {
          hasWoodstock: false,
        } as never,
      };

      it('should set component identity to null', () => {
        component.playerIdentitySelected(identity);

        expect(component.selectedPlayer).toBeNull();
      });
    });
  });
});
