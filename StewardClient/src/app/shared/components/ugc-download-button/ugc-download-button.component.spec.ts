import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { UgcDownloadButtonComponent } from './ugc-download-button.component';

describe('UgcDownloadButtonComponent', () => {
  let component: UgcDownloadButtonComponent;
  let fixture: ComponentFixture<UgcDownloadButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UgcDownloadButtonComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [MatMenuModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UgcDownloadButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
