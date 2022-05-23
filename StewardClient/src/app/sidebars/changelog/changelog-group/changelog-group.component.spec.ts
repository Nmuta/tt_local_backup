import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import faker from '@faker-js/faker';
import { createMockChangelogService } from '@services/changelog/changelog.service.mock';

import { ChangelogGroupComponent } from './changelog-group.component';

describe('ChangelogGroupComponent', () => {
  let component: ChangelogGroupComponent;
  let fixture: ComponentFixture<ChangelogGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangelogGroupComponent],
      providers: [createMockChangelogService()],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangelogGroupComponent);
    component = fixture.debugElement.componentInstance;
    component.group = {
      title: faker.random.word(),
      id: faker.datatype.uuid(),
      entries: [],
    };
  });

  it('should create', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));
});
