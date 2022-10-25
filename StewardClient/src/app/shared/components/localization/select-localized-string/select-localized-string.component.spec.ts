import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameTitle, LocalizationCategory, SupportedLocalizationLanguageCodes } from '@models/enums';
import { LocalizedString, LocalizedStringsMap } from '@models/localization';
import { PipesModule } from '@shared/pipes/pipes.module';
import { Observable } from 'rxjs';
import {
  SelectLocalizedStringComponent,
  SelectLocalizedStringContract,
} from './select-localized-string.component';

/** Test class for {@link SelectLocalizedStringContract}. */
class TestSelectLocalizedStringContract implements SelectLocalizedStringContract {
  gameTitle: GameTitle.FM8;
  /** Get localized strings. */
  getLocalizedStrings$(): Observable<LocalizedStringsMap> {
    return;
  }
}

describe('SelectLocalizedStringComponent', () => {
  let component: SelectLocalizedStringComponent;
  let fixture: ComponentFixture<SelectLocalizedStringComponent>;

  const mockService: TestSelectLocalizedStringContract = new TestSelectLocalizedStringContract();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectLocalizedStringComponent],
      imports: [PipesModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectLocalizedStringComponent);
    component = fixture.componentInstance;
    component.service = mockService;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnInit', () => {
    describe('When service is provided', () => {
      it('should not throw error', () => {
        try {
          fixture.detectChanges();

          expect(true).toBeTruthy();
        } catch (e) {
          expect(e).toEqual(null);
          expect(false).toBeTruthy();
        }
      });
    });

    describe('When service is null', () => {
      beforeEach(() => {
        component.service = null;
      });

      it('should throw error', () => {
        try {
          fixture.detectChanges();

          expect(false).toBeTruthy();
        } catch (e) {
          expect(true).toBeTruthy();
          expect(e.message).toEqual('No service defined for Select Localized String component.');
        }
      });
    });
  });

  describe('onLanguageChipSelect', () => {
    const testMessage: string = 'This is a test message.';
    const testLocalizedString: LocalizedString = {
      message: testMessage,
      category: LocalizationCategory.Notifications,
      languageCode: SupportedLocalizationLanguageCodes.en_US,
      isTranslated: true,
    };
    beforeEach(() => {
      component.selectedLocalizedStringCollection = [testLocalizedString];
    });

    describe('with MatChipListChange value', () => {
      it('should set selectedLanguageLocalizedString', () => {
        //Run the method with valid value
        component.onLanguageChipSelect({
          value: { languageCode: SupportedLocalizationLanguageCodes.en_US },
          source: null,
        });
        expect(component.selectedLanguageLocalizedString).toEqual(testLocalizedString);
      });
    });
  });
});
