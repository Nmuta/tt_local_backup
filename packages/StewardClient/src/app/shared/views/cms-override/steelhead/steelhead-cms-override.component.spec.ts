import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { createMockSteelheadPlayerCmsOverrideService } from '@services/api-v2/steelhead/player/cms-override/steelhead-player-cms-override.service.mock';
import { SteelheadCmsOverrideComponent } from './steelhead-cms-override.component';

describe('SteelheadCmsOverrideComponent', () => {
  let component: SteelheadCmsOverrideComponent;
  let fixture: ComponentFixture<SteelheadCmsOverrideComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot()],
      declarations: [SteelheadCmsOverrideComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [createMockSteelheadPlayerCmsOverrideService()],
    }).compileComponents();

    fixture = TestBed.createComponent(SteelheadCmsOverrideComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
