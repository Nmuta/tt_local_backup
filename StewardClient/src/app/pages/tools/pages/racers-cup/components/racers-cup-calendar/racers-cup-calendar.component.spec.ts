import { ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import faker from '@faker-js/faker';
import { createMockSteelheadService, SteelheadService } from '@services/steelhead';
import { CalendarModule, CalendarView, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { RacersCupCalendarComponent } from './racers-cup-calendar.component';
import BigNumber from 'bignumber.js';
import { of } from 'rxjs';
import { RacersCupCalendarInputs } from '../racers-cup-inputs/racers-cup-inputs.component';

describe('RacersCupCalendarComponent', () => {
  let component: RacersCupCalendarComponent;
  let fixture: ComponentFixture<RacersCupCalendarComponent>;
  let mockSteelheadService: SteelheadService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RacersCupCalendarComponent],
      imports: [
        MatDialogModule,
        CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
      ],
      providers: [createMockSteelheadService()],
    }).compileComponents();

    const injector = getTestBed();
    mockSteelheadService = injector.inject(SteelheadService);

    fixture = TestBed.createComponent(RacersCupCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('When a view is clicked', () => {
    const view = CalendarView.Month;

    it('should select that view', () => {
      component.setView(view);
      expect(component.view).toEqual(view);
    });
  });

  describe('When Search button is clicked', () => {
    const gamertag = faker.random.word();
    const inputs: RacersCupCalendarInputs = {
      identity: {
        query: { gamertag: gamertag },
        gamertag: gamertag,
        xuid: new BigNumber(faker.datatype.number()),
      },
      daysForward: faker.datatype.number(),
    };

    beforeEach(() => {
      mockSteelheadService.getRacersCupScheduleForUser$ = jasmine
        .createSpy('getRacersCupScheduleForUser')
        .and.returnValue(of({ championships: [] }));
      component.refreshTable(inputs);
    });

    it('should call service lookup method', () => {
      expect(mockSteelheadService.getRacersCupScheduleForUser$).toHaveBeenCalledWith(
        inputs.identity.xuid,
        null,
        inputs.daysForward,
      );
    });
  });
});