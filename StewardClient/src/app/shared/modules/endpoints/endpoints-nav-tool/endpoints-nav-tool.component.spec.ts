import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndpointsNavToolComponent } from './endpoints-nav-tool.component';

describe('EndpointsNavToolComponent', () => {
  let component: EndpointsNavToolComponent;
  let fixture: ComponentFixture<EndpointsNavToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EndpointsNavToolComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EndpointsNavToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
