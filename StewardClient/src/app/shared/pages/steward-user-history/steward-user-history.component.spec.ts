import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UserModel } from '@models/user.model';
import { NgxsModule, Store } from '@ngxs/store';
import {
  JsonTableAndBackgroundJob,
  StewardUserHistoryComponent,
} from './steward-user-history.component';
import faker from 'faker';
import { UserRole } from '@models/enums';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BackgroundJob, BackgroundJobStatus } from '@models/background-job';
import { toDateTime } from '@helpers/luxon';

describe('StewardUserHistoryComponent', () => {
  let component: StewardUserHistoryComponent;
  let fixture: ComponentFixture<StewardUserHistoryComponent>;

  let mockStore: Store;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot(),
          MatPaginatorModule,
        ],
        declarations: [StewardUserHistoryComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [],
      }).compileComponents();

      fixture = TestBed.createComponent(StewardUserHistoryComponent);
      component = fixture.debugElement.componentInstance;

      mockStore = TestBed.inject(Store);
      mockStore.selectSnapshot = jasmine.createSpy('selectSnapshot');
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnInit', () => {
    const name = faker.name.firstName();
    const profile = {
      emailAddress: `${name}@testemail.com`,
      role: UserRole.LiveOpsAdmin,
      name: name,
      objectId: faker.datatype.uuid(),
    } as UserModel;

    beforeEach(() => {
      mockStore.selectSnapshot = jasmine.createSpy('selectSnapshot').and.returnValue(profile);
      component.getBackgroundJobs$.next = jasmine.createSpy('next');
    });

    it('should set component profile', () => {
      component.ngOnInit();

      expect(component.profile).toEqual(profile);
    });

    it('should call getBackgroundJobs$.next', () => {
      component.ngOnInit();

      expect(component.getBackgroundJobs$.next).toHaveBeenCalled();
    });
  });

  describe('Method: ngAfterViewInit', () => {
    it('should set component profile', () => {
      component.ngAfterViewInit();

      expect(component.jobs.paginator).toEqual(component.paginator);
    });
  });

  describe('Method: setSelectedBackgroundJob', () => {
    describe('When selectedBackgroundJob result is an array', () => {
      let backgroundJob: BackgroundJob<unknown[]>;
      beforeEach(() => {
        backgroundJob = {
          createdDateUtc: toDateTime(faker.date.past()),
          jobId: faker.datatype.uuid(),
          status: BackgroundJobStatus.Completed,
          rawResult: { foo: 'bar' } as Record<string, unknown>,
          result: [{ foo: 'bar' }, { cat: 'dog' }],
          isRead: true,
          reason: faker.random.words(10),
          isMarkingRead: true,
        };
      });

      it('should not touch the array of results', () => {
        component.setSelectedBackgroundJob(backgroundJob);

        expect(Array.isArray(component.selectedBackgroundJob.jsonTableResults)).toBeTruthy();
        const testResult = component.selectedBackgroundJob.jsonTableResults as unknown[];
        expect(testResult?.length).toEqual(2);
      });
    });

    describe('When selectedBackgroundJob result is an object', () => {
      let backgroundJob: BackgroundJob<unknown>;
      beforeEach(() => {
        backgroundJob = {
          createdDateUtc: toDateTime(faker.date.past()),
          jobId: faker.datatype.uuid(),
          status: BackgroundJobStatus.Completed,
          rawResult: { foo: 'bar' },
          result: { foo: 'bar' },
          isRead: true,
          reason: faker.random.words(10),
          isMarkingRead: true,
        };
      });

      it('should convert single object into an array with single object', () => {
        component.setSelectedBackgroundJob(backgroundJob);

        expect(Array.isArray(component.selectedBackgroundJob.jsonTableResults)).toBeTruthy();
        const testResult = component.selectedBackgroundJob.jsonTableResults as unknown[];
        expect(testResult?.length).toEqual(1);
      });
    });
  });

  describe('Method: clearSelectedBackgroundJob', () => {
    beforeEach(() => {
      component.selectedBackgroundJob = {
        createdDateUtc: toDateTime(faker.date.past()),
        jobId: faker.datatype.uuid(),
        status: BackgroundJobStatus.Completed,
        rawResult: { foo: 'bar' },
        result: { foo: 'bar' },
        isRead: true,
        reason: faker.random.words(10),
        isMarkingRead: true,
        jsonTableResults: [],
      } as JsonTableAndBackgroundJob;
    });

    it('should set selectedBackgroundJob null', () => {
      component.clearSelectedBackgroundJob();

      expect(component.selectedBackgroundJob).toBeNull();
    });
  });
});
