import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { createMockSteelheadPlayerReportWeightService } from '@services/api-v2/steelhead/player/report-weight/steelhead-report-weight.service.mock';
import { SteelheadReportWeightComponent } from './steelhead-report-weight.component';

describe('SteelheadReportWeightComponent', () => {
  let component: SteelheadReportWeightComponent;
  let fixture: ComponentFixture<SteelheadReportWeightComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot()],
      declarations: [SteelheadReportWeightComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [createMockSteelheadPlayerReportWeightService()],
    }).compileComponents();

    fixture = TestBed.createComponent(SteelheadReportWeightComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
