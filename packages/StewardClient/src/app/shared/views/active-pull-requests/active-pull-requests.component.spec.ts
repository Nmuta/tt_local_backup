import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { GameTitle } from '@models/enums';
import {
  ActivePullRequestsComponent,
  ActivePullRequestsServiceContract,
} from './active-pull-requests.component';
import { of } from 'rxjs';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { PullRequest } from '@models/git-operation';
import { DateTime } from 'luxon';
import { faker } from '@interceptors/fake-api/utility';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PipesModule } from '@shared/pipes/pipes.module';

describe('ActivePullRequestsComponent', () => {
  let component: ActivePullRequestsComponent;
  let fixture: ComponentFixture<ActivePullRequestsComponent>;

  const mockPullRequest: PullRequest[] = [
    {
      id: faker.datatype.number(),
      webUrl: faker.datatype.string(),
      creationDateUtc: DateTime.utc(),
      title: faker.datatype.string(),
    },
  ];
  const mockService: ActivePullRequestsServiceContract = {
    gameTitle: GameTitle.FH5,
    abandonPermAttribute: PermAttributeName.UpdateMessageOfTheDay,
    getActivePullRequests$: () => of(mockPullRequest),
    abandonPullRequest$: () => of(null),
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PipesModule],
      declarations: [ActivePullRequestsComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivePullRequestsComponent);
    component = fixture.debugElement.componentInstance;
    component.service = mockService;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnInit', () => {
    it('should request active pull requests and set them on the component', () => {
      component.ngOnInit();

      expect(component.existingPullRequestList.data.length).toEqual(mockPullRequest.length);
      expect(component.existingPullRequestList.data[0].monitor).not.toBeUndefined();
    });
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
          expect(e.message).toEqual('No service is defined for cms override component.');
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
