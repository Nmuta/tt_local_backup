import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { createMockMsalServices } from '@mocks/msal.service.mock';
import { NgxsModule, Store } from '@ngxs/store';
import { createMockLoggerService } from '@services/logger/logger.service.mock';
import { UserState } from '@shared/state/user/user.state';
import { PlayerInventoryProfilePickerComponent } from './player-inventory-profile-picker.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('PlayerInventoryProfilePickerComponent', () => {
  let component: PlayerInventoryProfilePickerComponent;
  let fixture: ComponentFixture<PlayerInventoryProfilePickerComponent>;
  let mockStore: Store;

  beforeEach(async () => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot([UserState]),
        ],
        declarations: [PlayerInventoryProfilePickerComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [...createMockMsalServices(), createMockLoggerService()],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(PlayerInventoryProfilePickerComponent);
    component = fixture.debugElement.componentInstance;
    mockStore = TestBed.inject(Store);
    mockStore.dispatch = jasmine.createSpy('dispatch');
  });

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
          component.ngOnChanges(<any>{});

          expect(false).toBeTruthy();
        } catch (e) {
          expect(true).toBeTruthy();
          expect(e.message).toEqual(
            'No service is defined for player inventory profiles component.',
          );
        }
      });
    });

    describe('When service is provided', () => {
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
