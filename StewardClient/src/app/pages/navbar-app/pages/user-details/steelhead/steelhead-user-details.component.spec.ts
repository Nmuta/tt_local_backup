import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PipesModule } from '@shared/pipes/pipes.module';
import { UserDetailsComponent } from '../user-details.component';

import { SteelheadUserDetailsComponent } from './steelhead-user-details.component';

describe('SteelheadUserDetailsComponent', () => {
  let component: SteelheadUserDetailsComponent;
  let fixture: ComponentFixture<SteelheadUserDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SteelheadUserDetailsComponent],
      imports: [PipesModule],
      providers: [{ provide: UserDetailsComponent, useValue: {} }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SteelheadUserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});