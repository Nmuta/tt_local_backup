import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { createMockSunriseService } from '@services/sunrise';
import { PipesModule } from '@shared/pipes/pipes.module';

import { SunriseAuctionComponent } from './sunrise-auction.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('SunriseAuctionComponent', () => {
  let component: SunriseAuctionComponent;
  let fixture: ComponentFixture<SunriseAuctionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        declarations: [SunriseAuctionComponent],
        imports: [RouterTestingModule, PipesModule],
        providers: [createMockSunriseService()],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SunriseAuctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
