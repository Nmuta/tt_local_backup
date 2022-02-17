import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { createMockWoodstockService } from '@services/woodstock';
import { WoodstockLeaderboardStatsComponent } from './woodstock-leaderboard-stats.component';

describe('WoodstockLeaderboardStatsComponent', () => {
  let component: WoodstockLeaderboardStatsComponent;
  let fixture: ComponentFixture<WoodstockLeaderboardStatsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, NgxsModule.forRoot()],
        declarations: [WoodstockLeaderboardStatsComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [createMockWoodstockService()],
      }).compileComponents();

      fixture = TestBed.createComponent(WoodstockLeaderboardStatsComponent);
      component = fixture.debugElement.componentInstance;
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
