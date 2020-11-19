import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AadLoginComponent } from './aad-login.component';

describe('AadLoginComponent', () => {
  let component: AadLoginComponent;
  let fixture: ComponentFixture<AadLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AadLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AadLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
