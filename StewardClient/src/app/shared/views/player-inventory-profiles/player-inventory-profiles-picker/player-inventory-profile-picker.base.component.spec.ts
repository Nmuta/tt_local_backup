import { SimpleChange } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { IdentityResultAlpha, IdentityResultUnion } from '@models/identity-query.model';
import { ApolloPlayerInventoryProfilePickerComponent } from '../apollo/apollo-player-inventory-profile-picker.component';
import { OpusPlayerInventoryProfilePickerComponent } from '../opus/opus-player-inventory-profile-picker.component';
import { SunrisePlayerInventoryProfilePickerComponent } from '../sunrise/sunrise-player-inventory-profile-picker.component';
import { SteelheadPlayerInventoryProfilePickerComponent } from '../steelhead/steelhead-player-inventory-profile-picker.component';
import { WoodstockPlayerInventoryProfilePickerComponent } from '../woodstock/woodstock-player-inventory-profile-picker.component';

type AcceptableComponents =
  | WoodstockPlayerInventoryProfilePickerComponent
  | SteelheadPlayerInventoryProfilePickerComponent
  | SunrisePlayerInventoryProfilePickerComponent
  | ApolloPlayerInventoryProfilePickerComponent
  | OpusPlayerInventoryProfilePickerComponent;

/** Performs common behavior testing for Player Inventory Profile Pickers. */
export function baseTests<
  ComponentT extends AcceptableComponents,
  IdentityT extends IdentityResultUnion,
>(
  fixtureFn: () => ComponentFixture<ComponentT>,
  makeIdentityFn: (_?: unknown) => IdentityT,
  inventoryEndpointFn: () => (_?: unknown) => unknown[],
  replaceInventoryEndpointFn: (fn: jasmine.Spy) => void,
): void {
  let fixture: ComponentFixture<ComponentT>;
  let component: ComponentT;

  describe('(base tests)', () => {
    beforeEach(() => {
      fixture = fixtureFn();
      component = fixture.componentInstance;
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    describe('when valid identity received', () => {
      let inventoryEndpointSpy: jasmine.Spy;

      beforeEach(() => {
        inventoryEndpointSpy = jasmine
          .createSpy('inventoryEndpoint')
          .and.callFake(inventoryEndpointFn());
        replaceInventoryEndpointFn(inventoryEndpointSpy);

        component.profileChange.emit = jasmine.createSpy('profileChange.emit');

        component.identity = makeIdentityFn() as IdentityResultAlpha;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component.ngOnChanges(<any>{ identity: new SimpleChange(null, component.identity, true) });
        fixture.detectChanges();
      });

      it('should have called Profile Inventory Endpoint', () => {
        expect(inventoryEndpointSpy).toHaveBeenCalled();
      });

      it('should have populated profiles', () => {
        expect(component.profiles.length).toBeTruthy();
      });

      it('should have nulled out profileId', () => {
        expect(component.profileChange.emit).toHaveBeenCalled();
      });
    });
  });
}
