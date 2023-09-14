import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';

import { EndpointsNavToolComponent } from './endpoints-nav-tool.component';
import { MatMenuModule } from '@angular/material/menu';

describe('EndpointsNavToolComponent', () => {
  let component: EndpointsNavToolComponent;
  let fixture: ComponentFixture<EndpointsNavToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([]), MatMenuModule],
      declarations: [EndpointsNavToolComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EndpointsNavToolComponent);
    component = fixture.componentInstance;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
