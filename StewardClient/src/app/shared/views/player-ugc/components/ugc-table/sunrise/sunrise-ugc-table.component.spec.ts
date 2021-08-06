import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { createMockSunriseService } from '@services/sunrise/sunrise.service.mock';
import { BigJsonPipe } from '@shared/pipes/big-json.pipe';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SunriseUGCTableComponent } from './sunrise-ugc-table.component';

describe('SunriseUGCTableComponent', () => {
  let component: SunriseUGCTableComponent;
  let fixture: ComponentFixture<SunriseUGCTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, MatPaginatorModule, BrowserAnimationsModule],
      declarations: [SunriseUGCTableComponent, BigJsonPipe],
      providers: [createMockSunriseService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SunriseUGCTableComponent);
    component = fixture.componentInstance;
  });

  it(
    'should create',
    waitForAsync(() => {
      expect(component).toBeTruthy();
    }),
  );
});
