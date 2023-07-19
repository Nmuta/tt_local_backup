import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { createMockSteelheadPlayerDriverLevelService } from '@services/api-v2/steelhead/player/driver-level/steelhead-player-driver-level.service.mock';
import { SteelheadDriverLevelComponent } from './steelhead-driver-level.component';

describe('SteelheadDriverLevelComponent', () => {
  let component: SteelheadDriverLevelComponent;
  let fixture: ComponentFixture<SteelheadDriverLevelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot()],
      declarations: [SteelheadDriverLevelComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [createMockSteelheadPlayerDriverLevelService()],
    }).compileComponents();

    fixture = TestBed.createComponent(SteelheadDriverLevelComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
