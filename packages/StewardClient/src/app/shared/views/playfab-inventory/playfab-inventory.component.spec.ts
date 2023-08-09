import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { GameTitle } from '@models/enums';
import { of } from 'rxjs';
import { faker } from '@interceptors/fake-api/utility';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PipesModule } from '@shared/pipes/pipes.module';
import {
  PlayFabInventoryComponent,
  PlayFabInventoryServiceContract,
} from './playfab-inventory.component';
import { PlayFabInventoryItem } from '@services/api-v2/woodstock/playfab/player/inventory/woodstock-playfab-player-inventory.service';

describe('PlayFabInventoryComponent', () => {
  let component: PlayFabInventoryComponent;
  let fixture: ComponentFixture<PlayFabInventoryComponent>;

  const mockInventory: PlayFabInventoryItem[] = [
    {
      amount: faker.datatype.number(),
      id: faker.datatype.uuid(),
      stackId: faker.datatype.string(),
      type: faker.datatype.string(),
      name: faker.datatype.string(),
    },
  ];
  const mockService: PlayFabInventoryServiceContract = {
    gameTitle: GameTitle.FH5,
    getPlayFabCurrencyInventory$: () => of(mockInventory),
    getPlayFabVouchers$: () => of([]),
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PipesModule],
      declarations: [PlayFabInventoryComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayFabInventoryComponent);
    component = fixture.debugElement.componentInstance;
    component.service = mockService;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnChanges', () => {
    describe('When service is null', () => {
      beforeEach(() => {
        component.service = null;
      });

      it('should throw error', () => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          component.ngOnChanges({} as any);

          expect(false).toBeTruthy();
        } catch (e) {
          expect(true).toBeTruthy();
          expect(e.message).toEqual(
            'No service is defined for PlayFab transaction history component.',
          );
        }
      });
    });

    describe('When service is provided', () => {
      // Provided by default in the test component
      it('should not throw error', () => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          component.ngOnChanges({} as any);

          expect(true).toBeTruthy();
        } catch (e) {
          expect(e).toEqual(null);
          expect(false).toBeTruthy();
        }
      });
    });
  });
});
