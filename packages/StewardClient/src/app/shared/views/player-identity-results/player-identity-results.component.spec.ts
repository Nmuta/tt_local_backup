import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerIdentityResultsComponent } from './player-identity-results.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('PlayerIdentityResultsComponent', () => {
  let component: PlayerIdentityResultsComponent;
  let fixture: ComponentFixture<PlayerIdentityResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        declarations: [PlayerIdentityResultsComponent],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerIdentityResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
