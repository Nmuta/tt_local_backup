import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Navigate } from '@ngxs/router-plugin';
import { NgxsModule, Store } from '@ngxs/store';

import { AadLogoutComponent } from './aad-logout.component';

describe('AadLogoutComponent', () => {
  let component: AadLogoutComponent;
  let fixture: ComponentFixture<AadLogoutComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([])],
      declarations: [AadLogoutComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(Store);
    store.dispatch = jasmine.createSpy('dispatch');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AadLogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect', fakeAsync(() => {
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledTimes(0);
    tick(4_000);
    expect(store.dispatch).toHaveBeenCalledWith(new Navigate(['/']));
  }));
});
