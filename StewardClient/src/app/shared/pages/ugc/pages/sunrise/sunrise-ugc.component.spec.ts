import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { faker } from '@interceptors/fake-api/utility';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { AugmentedCompositeIdentity } from '@navbar-app/components/player-selection/player-selection-base.component';

import { SunriseUGCComponent } from './sunrise-ugc.component';

describe('SunriseUGCComponent', () => {
  let component: SunriseUGCComponent;
  let fixture: ComponentFixture<SunriseUGCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SunriseUGCComponent],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SunriseUGCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: onPlayerIdentityChange', () => {
    describe('When identity has sunrise identity', () => {
      const sunriseIdentity: IdentityResultAlpha = { gamertag: faker.random.word(), query: null };
      const identity: AugmentedCompositeIdentity = {
        query: null,
        result: null,
        general: null,
        woodstock: null,
        steelhead: null,
        sunrise: sunriseIdentity,
        gravity: null,
        apollo: null,
        opus: null,
        extra: {
          hasSunrise: true,
        } as never,
      };

      it('should set component identity to valid identity', () => {
        component.onPlayerIdentityChange(identity);

        expect(component.identity).toEqual(sunriseIdentity);
      });
    });

    describe('When identity does not have a sunrise identity', () => {
      const sunriseIdentity: IdentityResultAlpha = { gamertag: faker.random.word(), query: null };
      const identity: AugmentedCompositeIdentity = {
        query: null,
        result: null,
        general: null,
        woodstock: null,
        steelhead: null,
        sunrise: sunriseIdentity,
        gravity: null,
        apollo: null,
        opus: null,
        extra: {
          hasSunrise: false,
        } as never,
      };

      it('should set component identity to null', () => {
        component.onPlayerIdentityChange(identity);

        expect(component.identity).toBeNull();
      });
    });
  });

  describe('Method: playerIdentitySelected', () => {
    describe('When identity has sunrise identity', () => {
      const sunriseIdentity: IdentityResultAlpha = { gamertag: faker.random.word(), query: null };
      const identity: AugmentedCompositeIdentity = {
        query: null,
        result: null,
        general: null,
        woodstock: null,
        steelhead: null,
        sunrise: sunriseIdentity,
        gravity: null,
        apollo: null,
        opus: null,
        extra: {
          hasSunrise: true,
        } as never,
      };

      it('should set component identity to valid identity', () => {
        component.playerIdentitySelected(identity);

        expect(component.selectedPlayer).toEqual(sunriseIdentity);
      });
    });

    describe('When identity does not have a sunrise identity', () => {
      const sunriseIdentity: IdentityResultAlpha = { gamertag: faker.random.word(), query: null };
      const identity: AugmentedCompositeIdentity = {
        query: null,
        general: null,
        woodstock: null,
        steelhead: null,
        sunrise: sunriseIdentity,
        gravity: null,
        apollo: null,
        opus: null,
        result: null,
        extra: {
          hasSunrise: false,
        } as never,
      };

      it('should set component identity to null', () => {
        component.playerIdentitySelected(identity);

        expect(component.selectedPlayer).toBeNull();
      });
    });
  });
});
