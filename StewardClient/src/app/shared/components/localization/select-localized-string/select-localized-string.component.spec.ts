import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PipesModule } from '@shared/pipes/pipes.module';
import { SelectLocalizedStringComponent } from './select-localized-string.component';

describe('SelectLocalizedStringComponent', () => {
  let component: SelectLocalizedStringComponent;
  let fixture: ComponentFixture<SelectLocalizedStringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectLocalizedStringComponent],
      imports: [PipesModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectLocalizedStringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
