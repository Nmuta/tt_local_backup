import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableAppsComponent } from './available-apps.component';

describe('AvailableAppsComponent', () => {
  let component: AvailableAppsComponent;
  let fixture: ComponentFixture<AvailableAppsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AvailableAppsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailableAppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
