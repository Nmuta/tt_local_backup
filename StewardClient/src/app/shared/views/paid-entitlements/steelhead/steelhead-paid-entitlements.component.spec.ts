import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { SteelheadPaidEntitlementsComponent } from './steelhead-paid-entitlements.component';

describe('SteelheadPaidEntitlementsComponent', () => {
  let component: SteelheadPaidEntitlementsComponent;
  let fixture: ComponentFixture<SteelheadPaidEntitlementsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot()],
      declarations: [SteelheadPaidEntitlementsComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SteelheadPaidEntitlementsComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
