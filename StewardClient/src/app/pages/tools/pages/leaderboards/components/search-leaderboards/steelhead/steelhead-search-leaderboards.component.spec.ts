import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { createMockSteelheadLeaderboardsService } from '@services/api-v2/steelhead/leaderboards/steelhead-leaderboards.service.mock';
import { SteelheadSearchLeaderboardsComponent } from './steelhead-search-leaderboards.component';

// TODO: Doing these later when I am not on vacation (lugeiken)
// https://dev.azure.com/t10motorsport/Motorsport/_workitems/edit/958926
describe('SteelheadSearchLeaderboardsComponent', () => {
  let component: SteelheadSearchLeaderboardsComponent;
  let fixture: ComponentFixture<SteelheadSearchLeaderboardsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot()],
      declarations: [SteelheadSearchLeaderboardsComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [createMockSteelheadLeaderboardsService()],
    }).compileComponents();

    fixture = TestBed.createComponent(SteelheadSearchLeaderboardsComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
