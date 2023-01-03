import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WelcomeCenterTilesComponent } from './welcome-center-tiles.component';

describe('MessageOfTheDayComponent', () => {
  let component: WelcomeCenterTilesComponent;
  let fixture: ComponentFixture<WelcomeCenterTilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WelcomeCenterTilesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WelcomeCenterTilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
