import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterContentsComponent } from './center-contents.component';

describe('CenterContentsComponent', () => {
  let component: CenterContentsComponent;
  let fixture: ComponentFixture<CenterContentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CenterContentsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CenterContentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
