import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { createMockSteelheadPlayerDriverLevelService } from '@services/api-v2/steelhead/player/driver-level/steelhead-player-driver-level.service.mock';
import { SteelheadSafetyRatingComponent } from './steelhead-safety-rating.component';

describe('SteelheadSafetyRatingComponent', () => {
  let component: SteelheadSafetyRatingComponent;
  let fixture: ComponentFixture<SteelheadSafetyRatingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot()],
      declarations: [SteelheadSafetyRatingComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [createMockSteelheadPlayerDriverLevelService()],
    }).compileComponents();

    fixture = TestBed.createComponent(SteelheadSafetyRatingComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
