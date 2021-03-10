import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerLookupResultsComponent } from './player-lookup-results.component';

describe('PlayerLookupResultsComponent', () => {
  let component: PlayerLookupResultsComponent;
  let fixture: ComponentFixture<PlayerLookupResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlayerLookupResultsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerLookupResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
