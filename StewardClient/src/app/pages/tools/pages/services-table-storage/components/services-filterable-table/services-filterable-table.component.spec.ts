import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { createStandardTestModuleMetadata } from '@mocks/standard-test-module-metadata';
import { GameTitle } from '@models/enums';
import { GuidLikeString } from '@models/extended-types';
import { ServicesTableStorageEntity } from '@services/api-v2/steelhead/services-table-storage/services-table-storage.service';
import BigNumber from 'bignumber.js';
import { Observable, of } from 'rxjs';
import {
  ServicesFilterableTableComponent,
  ServicesTableStorageContract,
} from './services-filterable-table.component';

describe('ServicesFilterableTableComponent', () => {
  let component: ServicesFilterableTableComponent;
  let fixture: ComponentFixture<ServicesFilterableTableComponent>;
  const mockServicesTableStorage = [];

  const mockServiceContract: ServicesTableStorageContract = {
    gameTitle: GameTitle.FM8,
    xuid: new BigNumber(123456789),
    externalProfileId: '1face881-bb9c-460d-87af-f5549248abbf',
    getTableStorageByProfileId$(
      _: BigNumber,
      __: GuidLikeString,
    ): Observable<ServicesTableStorageEntity[]> {
      return of(mockServicesTableStorage);
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadata({
        declarations: [ServicesFilterableTableComponent, MatAutocomplete],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(ServicesFilterableTableComponent);
    component = fixture.componentInstance;
    component.contract = mockServiceContract;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnInit', () => {
    describe('When contract is null', () => {
      beforeEach(() => {
        component.contract = null;
      });

      it('should throw error', () => {
        try {
          component.ngOnChanges();

          expect(false).toBeTruthy();
        } catch (e) {
          expect(true).toBeTruthy();
          expect(e.message).toEqual(
            'Service Contract could not be found for Services Table Storage component.',
          );
        }
      });
    });

    describe('When contract is provided', () => {
      // Provided by default in the test component
      it('should not throw error', () => {
        try {
          fixture.detectChanges();

          expect(true).toBeTruthy();
        } catch (e) {
          expect(e).toEqual(null);
          expect(false).toBeTruthy();
        }
      });
    });
  });
});
