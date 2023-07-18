import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createMockSunriseService } from '@services/sunrise';

import { SunrisePlayerHiddenUgcComponent } from './sunrise-player-hidden-ugc.component';

describe('SunrisePlayerHiddenUgcComponent', () => {
  let component: SunrisePlayerHiddenUgcComponent;
  let fixture: ComponentFixture<SunrisePlayerHiddenUgcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SunrisePlayerHiddenUgcComponent],
      providers: [createMockSunriseService()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SunrisePlayerHiddenUgcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
