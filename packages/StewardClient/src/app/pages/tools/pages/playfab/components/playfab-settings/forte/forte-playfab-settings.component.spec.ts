import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { FortePlayFabSettingsComponent } from './forte-playfab-settings.component';

describe('FortePlayFabSettingsComponent', () => {
  let component: FortePlayFabSettingsComponent;
  let fixture: ComponentFixture<FortePlayFabSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NgxsModule.forRoot([]),
      ],
      declarations: [FortePlayFabSettingsComponent],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(FortePlayFabSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
