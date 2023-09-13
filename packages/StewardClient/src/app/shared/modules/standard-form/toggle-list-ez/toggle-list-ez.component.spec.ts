import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameTitle } from '@models/enums';
import { NEVER } from 'rxjs';
import { ToggleListComponent } from '../toggle-list/toggle-list.component';

import { ToggleListEzComponent } from './toggle-list-ez.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'ToggleListEzComponent', () => {
  let component: ToggleListEzComponent;
  let fixture: ComponentFixture<ToggleListEzComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        declarations: [ToggleListEzComponent, ToggleListComponent],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToggleListEzComponent);
    component = fixture.componentInstance;
    component.contract = {
      gameTitle: GameTitle.FH5,
      initialModel: {},
      order: [],
      title: 'test',
      submitModel$: () => NEVER,
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
