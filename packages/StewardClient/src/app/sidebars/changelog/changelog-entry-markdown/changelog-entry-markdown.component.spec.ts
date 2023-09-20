import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangelogEntryMarkdownComponent } from './changelog-entry-markdown.component';
import { createStandardTestModuleMetadata } from '@mocks/standard-test-module-metadata';
import { MarkdownModule } from 'ngx-markdown';
import { ChangelogTag } from '@environments/app-data/changelog';

describe('ChangelogEntryMarkdownComponent', () => {
  let component: ChangelogEntryMarkdownComponent;
  let fixture: ComponentFixture<ChangelogEntryMarkdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadata({
        declarations: [ChangelogEntryMarkdownComponent],
        imports: [MarkdownModule.forRoot()],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(ChangelogEntryMarkdownComponent);
    component = fixture.componentInstance;
    component.entry = {
      tag: ChangelogTag.All,
      shortMarkdown: 'Test but it has **bold**',
      uuid: '53c2eebd-1329-4f11-ad0b-cec5f69658c0',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
