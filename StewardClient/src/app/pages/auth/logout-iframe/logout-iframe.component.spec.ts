import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoutIframeComponent } from './logout-iframe.component';

describe('LogoutIframeComponent', () => {
  let component: LogoutIframeComponent;
  let fixture: ComponentFixture<LogoutIframeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogoutIframeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutIframeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
