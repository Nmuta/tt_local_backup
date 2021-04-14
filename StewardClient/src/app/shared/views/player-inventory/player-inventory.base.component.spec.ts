import { NO_ERRORS_SCHEMA, Type } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { SunriseMasterInventory } from '@models/sunrise';
import { PlayerInventoryBaseComponent } from './player-inventory.base.component';

describe('PlayerInventoryBaseComponent', () => {
  let component: PlayerInventoryBaseComponent<SunriseMasterInventory, IdentityResultAlpha>;
  let fixture: ComponentFixture<PlayerInventoryBaseComponent<
    SunriseMasterInventory,
    IdentityResultAlpha
  >>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [],
        declarations: [PlayerInventoryBaseComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [],
      }).compileComponents();

      fixture = TestBed.createComponent(
        PlayerInventoryBaseComponent as Type<
          PlayerInventoryBaseComponent<SunriseMasterInventory, IdentityResultAlpha>
        >,
      );
      component = fixture.debugElement.componentInstance;
    }),
  );

  it(
    'should create',
    waitForAsync(() => {
      expect(component).toBeTruthy();
    }),
  );
});
