import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ServicesTableResultsComponent } from './services-table-results.component';

describe('ServicesTableResultsComponent', () => {
  let fixture: ComponentFixture<ServicesTableResultsComponent>;
  let component: ServicesTableResultsComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), HttpClientTestingModule, NgxsModule.forRoot()],
      declarations: [ServicesTableResultsComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(ServicesTableResultsComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
