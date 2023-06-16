import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createMockSteelheadPlayerUgcService } from '@services/api-v2/steelhead/player/ugc/steelhead-player-ugc.service.mock';
import { createMockSteelheadUgcVisibilityService } from '@services/api-v2/steelhead/ugc/visibility/steelhead-ugc-visibility.service.mock';
import { SteelheadPlayerHiddenUgcComponent } from './steelhead-player-hidden-ugc.component';

describe('SteelheadPlayerHiddenUgcComponent', () => {
  let component: SteelheadPlayerHiddenUgcComponent;
  let fixture: ComponentFixture<SteelheadPlayerHiddenUgcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SteelheadPlayerHiddenUgcComponent],
      providers: [createMockSteelheadUgcVisibilityService(), createMockSteelheadPlayerUgcService()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SteelheadPlayerHiddenUgcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
