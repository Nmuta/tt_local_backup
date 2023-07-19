import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PipesModule } from '@shared/pipes/pipes.module';
import { CreateLocalizedStringComponent } from './create-localized-string.component';

describe('CreateLocalizedStringComponent', () => {
  let component: CreateLocalizedStringComponent;
  let fixture: ComponentFixture<CreateLocalizedStringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateLocalizedStringComponent],
      imports: [PipesModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLocalizedStringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
