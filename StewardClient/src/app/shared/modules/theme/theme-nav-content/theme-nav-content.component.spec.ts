import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { ThemeService } from '../theme.service';

import { ThemeNavContentComponent } from './theme-nav-content.component';

describe('ThemeNavContentComponent', () => {
  let component: ThemeNavContentComponent;
  let fixture: ComponentFixture<ThemeNavContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThemeNavContentComponent],
      imports: [NgxsModule.forRoot()],
      providers: [ThemeService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeNavContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
