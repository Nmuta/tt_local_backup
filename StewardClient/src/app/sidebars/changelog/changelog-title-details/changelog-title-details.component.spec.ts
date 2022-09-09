import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { createMockChangelogService } from '@services/changelog/changelog.service.mock';

import { ChangelogTitleDetailsComponent } from './changelog-title-details.component';

describe('ChangelogTitleDetailsComponent', () => {
  let component: ChangelogTitleDetailsComponent;
  let fixture: ComponentFixture<ChangelogTitleDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangelogTitleDetailsComponent],
      providers: [createMockChangelogService()],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangelogTitleDetailsComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should create', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));
});
