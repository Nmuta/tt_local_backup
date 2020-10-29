import { HttpErrorResponse } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  getTestBed,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { SunriseConsoleDetails } from '@models/sunrise/sunrise-console-details.model';
import { SunriseService } from '@services/sunrise/sunrise.service';
import { createMockSunriseService } from '@services/sunrise/sunrise.service.mock';
import _ from 'lodash';
import { Subject } from 'rxjs';

import { ConsolesComponent } from './consoles.component';

describe('ConsolesComponent', () => {
  let injector: TestBed;
  let service: SunriseService;
  let component: ConsolesComponent;
  let fixture: ComponentFixture<ConsolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConsolesComponent],
      providers: [createMockSunriseService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    injector = getTestBed();
    service = injector.inject(SunriseService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', waitForAsync(() => {
      expect(component).toBeTruthy();
    })
  );

  describe('ngOnChanges', () => {
    const subject: Subject<SunriseConsoleDetails> = undefined;

    beforeEach(() => {
      const subject = new Subject<SunriseConsoleDetails>();
      service.getConsoleDetailsByXuid = jasmine.createSpy("getConsoleDetailsByXuid").and.returnValue(subject);

      // emulate initialization event
      component.ngOnChanges();
    });

    it('should skip undefined xuids', waitForAsync(() => {
        expect(component.isLoading).toBe(false);
        expect(component.loadError).toBeFalsy();
      })
    );
  
    it('should update when xuid set', waitForAsync(() => {
        // emulate xuid update event
        component.xuid = _.random(false);
        component.ngOnChanges();
  
        // waiting on value
        fixture.detectChanges();
        expect(component.isLoading).toBe(true);
  
        // value received
        subject.next({} as any);
        fixture.detectChanges();
        expect(component.isLoading).toBe(false);
        expect(component.loadError).toBeFalsy();
      })
    );
  
    it('should update when request errored', waitForAsync(() => {
        // emulate xuid update event
        component.xuid = _.random(false);
        component.ngOnChanges();
  
        // waiting on value
        fixture.detectChanges();
        expect(component.isLoading).toBe(true);
  
        // error received
        subject.error(new HttpErrorResponse({}));
        fixture.detectChanges();
        expect(component.isLoading).toBe(false);
        expect(component.loadError).toBeTruthy();
      })
    );
  });

  describe('banActions', () => {

  })
});
