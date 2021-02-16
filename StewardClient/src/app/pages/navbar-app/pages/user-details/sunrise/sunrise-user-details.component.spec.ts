import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PipesModule } from '@shared/pipes/pipes.module';
import { UserDetailsComponent } from '../user-details.component';

import { SunriseUserDetailsComponent } from './sunrise-user-details.component';

describe('SunriseUserDetailsComponent', () => {
  let component: SunriseUserDetailsComponent;
  let fixture: ComponentFixture<SunriseUserDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SunriseUserDetailsComponent],
      imports: [PipesModule],
      providers: [{ provide: UserDetailsComponent, useValue: {} }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SunriseUserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it(
    'should create',
    waitForAsync(() => {
      expect(component).toBeTruthy();
    }),
  );
});
