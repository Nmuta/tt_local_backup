import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { createMockMsalServices } from '@mocks/msal.service.mock';
import { NgxsModule, Store } from '@ngxs/store';
import { createMockLoggerService } from '@services/logger/logger.service.mock';
import { UserState } from '@shared/state/user/user.state';
import { WoodstockPlayerInventoryProfilePickerComponent } from './woodstock-player-inventory-profile-picker.component';

describe('WoodstockPlayerInventoryProfilePickerComponent', () => {
  let component: WoodstockPlayerInventoryProfilePickerComponent;
  let fixture: ComponentFixture<WoodstockPlayerInventoryProfilePickerComponent>;
  let mockStore: Store;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NgxsModule.forRoot([UserState]),
      ],
      declarations: [WoodstockPlayerInventoryProfilePickerComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [...createMockMsalServices(), createMockLoggerService()],
    }).compileComponents();

    fixture = TestBed.createComponent(WoodstockPlayerInventoryProfilePickerComponent);
    component = fixture.debugElement.componentInstance;
    mockStore = TestBed.inject(Store);
    mockStore.dispatch = jasmine.createSpy('dispatch');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
