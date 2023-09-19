import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangelogEntryMarkdownComponent } from './changelog-entry-markdown.component';

describe('ChangelogEntryMarkdownComponent', () => {
  let component: ChangelogEntryMarkdownComponent;
  let fixture: ComponentFixture<ChangelogEntryMarkdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangelogEntryMarkdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangelogEntryMarkdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
