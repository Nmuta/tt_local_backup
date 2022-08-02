import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { createMockWoodstockService } from '@services/woodstock';
import { WoodstockReportWeightComponent } from './woodstock-report-weight.component';

describe('WoodstockReportWeightComponent', () => {
  let component: WoodstockReportWeightComponent;
  let fixture: ComponentFixture<WoodstockReportWeightComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot()],
      declarations: [WoodstockReportWeightComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [createMockWoodstockService()],
    }).compileComponents();

    fixture = TestBed.createComponent(WoodstockReportWeightComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
