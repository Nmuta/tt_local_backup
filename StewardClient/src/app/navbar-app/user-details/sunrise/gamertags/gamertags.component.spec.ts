import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamertagsComponent } from './gamertags.component';

describe('GamertagsComponent', () => {
  let component: GamertagsComponent;
  let fixture: ComponentFixture<GamertagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GamertagsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GamertagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
