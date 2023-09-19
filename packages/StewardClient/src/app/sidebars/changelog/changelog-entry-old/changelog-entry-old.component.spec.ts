import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangelogEntryOldComponent } from './changelog-entry-old.component';

describe('ChangelogEntryOldComponent', () => {
  let component: ChangelogEntryOldComponent;
  let fixture: ComponentFixture<ChangelogEntryOldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangelogEntryOldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangelogEntryOldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
