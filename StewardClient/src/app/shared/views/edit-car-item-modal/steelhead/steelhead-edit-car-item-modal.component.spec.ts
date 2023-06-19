import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PipesModule } from '@shared/pipes/pipes.module';
import { of } from 'rxjs';
import { SteelheadEditCarItemModalComponent } from './steelhead-edit-car-item-modal.component';
import { createMockSteelheadPlayerInventoryService } from '@services/api-v2/steelhead/player/inventory/steelhead-player-inventory.service.mock';
import { EditCarItemModalData } from '../edit-car-item-modal.component';
import faker from '@faker-js/faker';
import BigNumber from 'bignumber.js';

describe('SteelheadEditCarItemModalComponent', () => {
  let fixture: ComponentFixture<SteelheadEditCarItemModalComponent>;
  let component: SteelheadEditCarItemModalComponent;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockMatDialogRef: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SteelheadEditCarItemModalComponent],
      imports: [MatButtonModule, MatDialogModule, PipesModule],
      providers: [
        createMockSteelheadPlayerInventoryService(),
        {
          provide: MatDialogRef,
          useValue: { close: () => null, beforeClosed: () => of() },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            xuid: new BigNumber(faker.datatype.number()),
            externalProfileId: faker.datatype.uuid(),
            car: {
              id: new BigNumber(faker.datatype.number()),
            },
          } as EditCarItemModalData,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SteelheadEditCarItemModalComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    mockMatDialogRef = TestBed.inject(MatDialogRef);
    mockMatDialogRef.close = jasmine.createSpy('close');
    mockMatDialogRef.beforeClosed = jasmine.createSpy('beforeClosed').and.returnValue(of());
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: saveCarUpdates', () => {
    beforeEach(() => {
      component.editCarItem$ = jasmine.createSpy('editCarItem$').and.returnValue(of(null));
      component.getCarItem$ = jasmine.createSpy('getCarItem$').and.returnValue(of(null));
    });

    it('should call editCarItem$ & getCarItem$', () => {
      component.saveCarUpdates();

      expect(component.getCarItem$).toHaveBeenCalled();
      expect(component.editCarItem$).toHaveBeenCalled();
    });
  });
});
