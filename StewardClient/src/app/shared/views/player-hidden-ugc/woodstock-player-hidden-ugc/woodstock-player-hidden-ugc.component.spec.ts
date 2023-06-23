import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createMockWoodstockPlayerUgcService } from '@services/api-v2/woodstock/player/ugc/woodstock-player-ugc.service.mock';
import { createMockWoodstockUgcVisibilityService } from '@services/api-v2/woodstock/ugc/visibility/woodstock-ugc-visibility.service.mock';

import { WoodstockPlayerHiddenUgcComponent } from './woodstock-player-hidden-ugc.component';

describe('WoodstockPlayerHiddenUgcComponent', () => {
  let component: WoodstockPlayerHiddenUgcComponent;
  let fixture: ComponentFixture<WoodstockPlayerHiddenUgcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [WoodstockPlayerHiddenUgcComponent],
      providers: [createMockWoodstockPlayerUgcService(), createMockWoodstockUgcVisibilityService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WoodstockPlayerHiddenUgcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
