import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { WoodstockProfileNotesComponent } from './woodstock-profile-notes.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgxsModule } from '@ngxs/store';
import { createMockWoodstockPlayerProfileNotesService } from '@services/api-v2/woodstock/player/profile-notes/woodstock-player-profile-notes.service.mock';

describe('WoodstockProfileNotesComponent', () => {
  let component: WoodstockProfileNotesComponent;
  let fixture: ComponentFixture<WoodstockProfileNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot()],
      declarations: [WoodstockProfileNotesComponent],
      providers: [createMockWoodstockPlayerProfileNotesService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WoodstockProfileNotesComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should create', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));
});
