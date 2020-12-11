import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { GameTitleCodeName } from '@models/enums';

import { TitleDropdownComponent } from './title-dropdown.component';

describe('TitleDropdownComponent', () => {
  let fixture: ComponentFixture<TitleDropdownComponent>;
  let component: TitleDropdownComponent;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [],
        declarations: [TitleDropdownComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [],
      }).compileComponents();

      fixture = TestBed.createComponent(TitleDropdownComponent);
      component = fixture.debugElement.componentInstance;

      component.titleOptions = [
        GameTitleCodeName.Street
      ];
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
