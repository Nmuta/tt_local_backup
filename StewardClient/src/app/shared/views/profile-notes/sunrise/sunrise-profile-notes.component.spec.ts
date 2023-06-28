import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgxsModule } from '@ngxs/store';
import { SunriseProfileNotesComponent } from './sunrise-profile-notes.component';
import { createMockSunrisePlayerProfileNotesService } from '@services/api-v2/sunrise/player/profile-notes/sunrise-player-profile-notes.service.mock';

describe('SunriseProfileNotesComponent', () => {
  let component: SunriseProfileNotesComponent;
  let fixture: ComponentFixture<SunriseProfileNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot()],
      declarations: [SunriseProfileNotesComponent],
      providers: [createMockSunrisePlayerProfileNotesService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SunriseProfileNotesComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should create', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));
});
