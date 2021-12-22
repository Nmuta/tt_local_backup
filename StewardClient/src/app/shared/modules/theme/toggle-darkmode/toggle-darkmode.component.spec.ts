import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { ThemeService } from '../theme.service';

import { ToggleDarkmodeComponent } from './toggle-darkmode.component';

describe('ToggleDarkmodeComponent', () => {
  let component: ToggleDarkmodeComponent;
  let fixture: ComponentFixture<ToggleDarkmodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToggleDarkmodeComponent],
      imports: [NgxsModule.forRoot()],
      providers: [ThemeService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToggleDarkmodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
