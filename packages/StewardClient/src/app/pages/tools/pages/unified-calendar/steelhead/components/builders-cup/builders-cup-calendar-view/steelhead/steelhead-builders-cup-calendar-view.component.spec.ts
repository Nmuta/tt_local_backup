import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, getTestBed, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { SteelheadBuildersCupService } from '@services/api-v2/steelhead/builders-cup/steelhead-builders-cup.service';
import { createMockSteelheadBuildersCupService } from '@services/api-v2/steelhead/builders-cup/steelhead-builders-cup.service.mock';
import { CalendarModule, CalendarView, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { max } from 'lodash';
import { SteelheadBuildersCupCalendarViewComponent } from './steelhead-builders-cup-calendar-view.component';

describe('SteelheadBuildersCupCalendarViewComponent', () => {
  let component: SteelheadBuildersCupCalendarViewComponent;
  let fixture: ComponentFixture<SteelheadBuildersCupCalendarViewComponent>;
  let mockSteelheadService: SteelheadBuildersCupService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
      ],
      declarations: [SteelheadBuildersCupCalendarViewComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [createMockSteelheadBuildersCupService()],
    }).compileComponents();

    const injector = getTestBed();
    mockSteelheadService = injector.inject(SteelheadBuildersCupService);

    fixture = TestBed.createComponent(SteelheadBuildersCupCalendarViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnInit', () => {
    it('should call service lookup method', () => {
      expect(mockSteelheadService.getBuildersCupSchedule$).toHaveBeenCalled();
      expect(component.buildersCupSchedule.length).toEqual(1);
      expect(component.events.length).toEqual(0);
      expect(component.filteredEvents.length).toEqual(0);
    });
  });

  describe('When tourCount is referenced', () => {
    beforeEach(waitForAsync(() => {
      const testArray = ['Decades', 'Touring'];
      component.uniqueTours = testArray;

      it('should return length', () => {
        expect(component.tourCount).toEqual(max([testArray.length, 5]));
      });
    }));
  });

  describe('When a view is clicked', () => {
    const view = CalendarView.Month;

    it('should select that view', () => {
      component.setView(view);
      expect(component.view).toEqual(view);
    });
  });
});
