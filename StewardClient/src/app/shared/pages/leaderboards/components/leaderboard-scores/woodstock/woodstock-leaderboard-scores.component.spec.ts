import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { createMockWoodstockService } from '@services/woodstock';
import { WoodstockLeaderboardScoresComponent } from './woodstock-leaderboard-scores.component';

// TODO: Doing these later when I am not on vacation (lugeiken)
// https://dev.azure.com/t10motorsport/Motorsport/_workitems/edit/958926
describe('WoodstockLeaderboardScoresComponent', () => {
  let component: WoodstockLeaderboardScoresComponent;
  let fixture: ComponentFixture<WoodstockLeaderboardScoresComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, NgxsModule.forRoot()],
        declarations: [WoodstockLeaderboardScoresComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [createMockWoodstockService()],
      }).compileComponents();

      fixture = TestBed.createComponent(WoodstockLeaderboardScoresComponent);
      component = fixture.debugElement.componentInstance;
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
