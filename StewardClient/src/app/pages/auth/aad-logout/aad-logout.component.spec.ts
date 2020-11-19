import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AadLogoutComponent } from './aad-logout.component';

describe('AadLogoutComponent', () => {
  let component: AadLogoutComponent;
  let fixture: ComponentFixture<AadLogoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AadLogoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AadLogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
