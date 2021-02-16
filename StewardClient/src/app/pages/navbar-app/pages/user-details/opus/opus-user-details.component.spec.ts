import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PipesModule } from '@shared/pipes/pipes.module';
import { UserDetailsComponent } from '../user-details.component';

import { OpusUserDetailsComponent } from './opus-user-details.component';

describe('OpusUserDetailsComponent', () => {
  let component: OpusUserDetailsComponent;
  let fixture: ComponentFixture<OpusUserDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpusUserDetailsComponent],
      imports: [PipesModule],
      providers: [{ provide: UserDetailsComponent, useValue: {} }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpusUserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
