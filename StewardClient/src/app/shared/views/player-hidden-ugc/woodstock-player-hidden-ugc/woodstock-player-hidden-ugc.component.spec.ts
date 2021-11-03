import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createMockWoodstockService } from '@services/woodstock';

import { WoodstockPlayerHiddenUgcComponent } from './woodstock-player-hidden-ugc.component';

describe('WoodstockPlayerHiddenUgcComponent', () => {
  let component: WoodstockPlayerHiddenUgcComponent;
  let fixture: ComponentFixture<WoodstockPlayerHiddenUgcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WoodstockPlayerHiddenUgcComponent],
      providers: [createMockWoodstockService()],
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
