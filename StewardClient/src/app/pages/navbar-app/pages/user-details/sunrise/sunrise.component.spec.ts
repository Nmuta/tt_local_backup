import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PipesModule } from '@shared/pipes/pipes.module';
import { UserDetailsComponent } from '../user-details.component';

import { SunriseComponent } from './sunrise.component';

describe('SunriseComponent', () => {
  let component: SunriseComponent;
  let fixture: ComponentFixture<SunriseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SunriseComponent],
      imports: [PipesModule],
      providers: [{ provide: UserDetailsComponent, useValue: {} }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SunriseComponent);
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
