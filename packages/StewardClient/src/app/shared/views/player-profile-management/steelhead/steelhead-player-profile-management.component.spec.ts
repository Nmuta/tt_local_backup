import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { createMockWoodstockService } from '@services/woodstock';
import { SteelheadPlayerProfileManagementComponent } from './steelhead-player-profile-management.component';

describe('SteelheadPlayerProfileManagementComponent', () => {
  let component: SteelheadPlayerProfileManagementComponent;
  let fixture: ComponentFixture<SteelheadPlayerProfileManagementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot()],
      declarations: [SteelheadPlayerProfileManagementComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [createMockWoodstockService()],
    }).compileComponents();

    fixture = TestBed.createComponent(SteelheadPlayerProfileManagementComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
