import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GravityBanningComponent } from './gravity-banning.component';

describe('GravityBanningComponent', () => {
  let component: GravityBanningComponent;
  let fixture: ComponentFixture<GravityBanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GravityBanningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GravityBanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
