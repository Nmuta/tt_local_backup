import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { WoodstockLeaderboardsComponent } from './woodstock-leaderboards.component';

describe('WoodstockLeaderboardsComponent', () => {
  let component: WoodstockLeaderboardsComponent;
  let fixture: ComponentFixture<WoodstockLeaderboardsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [WoodstockLeaderboardsComponent],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(WoodstockLeaderboardsComponent);
      component = fixture.debugElement.componentInstance;
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
