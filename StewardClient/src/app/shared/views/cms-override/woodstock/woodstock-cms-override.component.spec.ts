import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { createMockWoodstockPlayerCmsOverrideService } from '@services/api-v2/woodstock/player/cms-override/woodstock-player-cms-override.service.mock';
import { WoodstockCmsOverrideComponent } from './woodstock-cms-override.component';

describe('WoodstockCmsOverrideComponent', () => {
  let component: WoodstockCmsOverrideComponent;
  let fixture: ComponentFixture<WoodstockCmsOverrideComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot()],
      declarations: [WoodstockCmsOverrideComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [createMockWoodstockPlayerCmsOverrideService()],
    }).compileComponents();

    fixture = TestBed.createComponent(WoodstockCmsOverrideComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
