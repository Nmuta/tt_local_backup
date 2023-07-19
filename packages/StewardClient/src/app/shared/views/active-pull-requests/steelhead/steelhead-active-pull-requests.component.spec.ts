import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SteelheadActivePullRequestsComponent } from './steelhead-active-pull-requests.component';
import { createMockSteelheadGitOperationService } from '@services/api-v2/steelhead/git-operation/steelhead-git-operation.service.mock';

describe('SteelheadActivePullRequestsComponent', () => {
  let component: SteelheadActivePullRequestsComponent;
  let fixture: ComponentFixture<SteelheadActivePullRequestsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [SteelheadActivePullRequestsComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [createMockSteelheadGitOperationService()],
    }).compileComponents();

    fixture = TestBed.createComponent(SteelheadActivePullRequestsComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
