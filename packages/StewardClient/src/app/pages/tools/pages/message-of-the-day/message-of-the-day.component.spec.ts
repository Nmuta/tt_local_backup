import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageOfTheDayComponent } from './message-of-the-day.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'MessageOfTheDayComponent', () => {
  let component: MessageOfTheDayComponent;
  let fixture: ComponentFixture<MessageOfTheDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        declarations: [MessageOfTheDayComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(MessageOfTheDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
