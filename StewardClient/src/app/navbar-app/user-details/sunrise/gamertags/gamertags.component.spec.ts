import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { createMockSunriseService } from '@services/sunrise/sunrise.service.mock';

import { GamertagsComponent } from './gamertags.component';

describe('GamertagsComponent', () => {
  let component: GamertagsComponent;
  let fixture: ComponentFixture<GamertagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GamertagsComponent],
      providers: [createMockSunriseService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GamertagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it(
    'should create',
    waitForAsync(() => {
      expect(component).toBeTruthy();
    })
  );
});
