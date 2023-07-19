import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { createMockChangelogService } from '@services/changelog/changelog.service.mock';

import { ChangelogTagDetailsComponent } from './changelog-tag-details.component';

describe('ChangelogTagDetailsComponent', () => {
  let component: ChangelogTagDetailsComponent;
  let fixture: ComponentFixture<ChangelogTagDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangelogTagDetailsComponent],
      providers: [createMockChangelogService()],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangelogTagDetailsComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should create', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));
});
