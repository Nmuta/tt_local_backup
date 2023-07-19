import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgxsModule } from '@ngxs/store';
import { SteelheadProfileNotesComponent } from './steelhead-profile-notes.component';
import { createMockSteelheadPlayerProfileNotesService } from '@services/api-v2/steelhead/player/profile-notes/steelhead-player-profile-notes.service.mock';

describe('SteelheadProfileNotesComponent', () => {
  let component: SteelheadProfileNotesComponent;
  let fixture: ComponentFixture<SteelheadProfileNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot()],
      declarations: [SteelheadProfileNotesComponent],
      providers: [createMockSteelheadPlayerProfileNotesService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SteelheadProfileNotesComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should create', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));
});
