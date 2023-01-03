import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { createMockWoodstockService } from '@services/woodstock';
import { SteelheadLeaderboardStatsComponent } from './steelhead-leaderboard-stats.component';

describe('SteelheadLeaderboardStatsComponent', () => {
  let component: SteelheadLeaderboardStatsComponent;
  let fixture: ComponentFixture<SteelheadLeaderboardStatsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot()],
      declarations: [SteelheadLeaderboardStatsComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [createMockWoodstockService()],
    }).compileComponents();

    fixture = TestBed.createComponent(SteelheadLeaderboardStatsComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
