import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangelogEntryOldComponent } from './changelog-entry-old.component';
import { createStandardTestModuleMetadata } from '@mocks/standard-test-module-metadata';
import { ChangelogTag } from '@environments/app-data/changelog';

describe('ChangelogEntryOldComponent', () => {
  let component: ChangelogEntryOldComponent;
  let fixture: ComponentFixture<ChangelogEntryOldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadata({
        declarations: [ChangelogEntryOldComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(ChangelogEntryOldComponent);
    component = fixture.componentInstance;
    component.entry = {
      tag: ChangelogTag.All,
      shortText: 'test',
      uuid: '53c2eebd-1329-4f11-ad0b-cec5f69658c0',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
