import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleMemoryRedirectLandingComponent } from './title-memory-redirect-landing.component';

describe('TitleMemoryRedirectLandingComponent', () => {
  let component: TitleMemoryRedirectLandingComponent;
  let fixture: ComponentFixture<TitleMemoryRedirectLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TitleMemoryRedirectLandingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TitleMemoryRedirectLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
