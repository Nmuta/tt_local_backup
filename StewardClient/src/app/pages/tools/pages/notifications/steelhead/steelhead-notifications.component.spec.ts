import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { SteelheadNotificationsComponent } from './steelhead-notifications.component';

describe('SunriseNotificationsComponent', () => {
  let component: SteelheadNotificationsComponent;
  let fixture: ComponentFixture<SteelheadNotificationsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot()],
      declarations: [SteelheadNotificationsComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [SteelheadNotificationsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SteelheadNotificationsComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.sendMessageService).toBeTruthy();
    expect(component.localizationCreationService).toBeTruthy();
    expect(component.localizationSelectionService).toBeTruthy();
    expect(component.localizedIndividualMessagingManagementService).toBeTruthy();
    expect(component.localizedGroupMessagingManagementService).toBeTruthy();
  });

  describe('viewSelectionTypeChange', () => {
    describe('should properly update edit status', () => {
      it('when first tab selected', () => {
        component.viewSelectionTypeChange(0);
        expect(component.isInEditTab).toBeFalsy();
      });

      it('when second tab selected', () => {
        component.viewSelectionTypeChange(1);
        expect(component.isInEditTab).toBeFalsy();
      });

      it('when third tab selected', () => {
        component.viewSelectionTypeChange(2);
        expect(component.isInEditTab).toBeFalsy();
      });
    });
  });
});
