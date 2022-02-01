import { Component, forwardRef, OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import { first } from 'lodash';
import { Duration } from 'luxon';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DurationPickerOptions } from '../duration-picker/duration-picker.component';

type BanReasonGroup = { group: string; values: string[] };
type StandardBanReasons = BanReasonGroup[];
const STANDARD_BAN_REASONS: StandardBanReasons = [
  {
    group: 'Abusive',
    values: [
      'Harassment or bullying',
      'Hate speech',
      'Notorious iconography, organizations or events',
      'Profanity',
      'Racism',
    ],
  },
  {
    group: 'Cheating',
    values: [
      'Device exploitation',
      'In-game glitches or exploits',
      'Modifying game files',
      'Purchasing content/accounts third-parties',
      'Selling in-game content',
    ],
  },
  {
    group: 'Content Incident',
    values: [
      'Abhorrent violent material (AVM)',
      'Child endangerment',
      'Child sexual exploitation or abuse',
    ],
  },
  {
    group: 'Disruptive',
    values: [
      'Defamation, impersonation, false information',
      'Fraud',
      'Illegal activities',
      'Illegal drugs or controlled substances',
      'Personal information',
      'Spam of advertising',
      'Unsportsmanlike conduct',
    ],
  },
  { group: 'Imminent Harm', values: ['Imminent harm to person/property', 'Self-harm or suicide'] },
  {
    group: 'Sexual Content',
    values: [
      'Non-consensual intimate imagery',
      'Obscene imagery',
      'Pornographic logos and similar',
      'Sexually inappropriate',
    ],
  },
  {
    group: 'Violence',
    values: ['Harm against people or animals', 'Terrorism or violent extremism', 'Violent acts'],
  },
];

export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.toLowerCase().includes(filterValue));
};
export enum BanArea {
  AllFeatures = 'AllRequests',
  UserGeneratedContent = 'UserGeneratedContent',
  Matchmaking = 'Matchmaking',
}

export interface BanOptions {
  banArea: BanArea;
  banReason: string;
  banDuration: Duration;
  checkboxes: {
    banAllXboxes: boolean;
    banAllPCs: boolean;
    deleteLeaderboardEntries: boolean;
  };
}

/** The ban-options panel. */
@Component({
  selector: 'ban-options',
  templateUrl: './ban-options.component.html',
  styleUrls: ['./ban-options.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BanOptionsComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => BanOptionsComponent),
      multi: true,
    },
  ],
})
export class BanOptionsComponent implements ControlValueAccessor, Validator, OnInit {
  public defaults: BanOptions = {
    banArea: BanArea.AllFeatures,
    banReason: '',
    banDuration: first(DurationPickerOptions).duration,
    checkboxes: {
      banAllXboxes: false,
      banAllPCs: false,
      deleteLeaderboardEntries: false,
    },
  };

  public formControls = {
    banArea: new FormControl(this.defaults.banArea, [Validators.required]),
    banReason: new FormControl(this.defaults.banReason, [Validators.required]),
    banDuration: new FormControl(this.defaults.banDuration, [Validators.required]),
    checkboxes: {
      banAllXboxes: new FormControl(this.defaults.checkboxes.banAllXboxes),
      banAllPCs: new FormControl(this.defaults.checkboxes.banAllPCs),
      deleteLeaderboardEntries: new FormControl(this.defaults.checkboxes.deleteLeaderboardEntries),
    },
  };

  public formGroup = new FormGroup({
    banArea: this.formControls.banArea,
    banReason: this.formControls.banReason,
    banDuration: this.formControls.banDuration,
    checkboxes: new FormGroup({
      banAllXboxes: this.formControls.checkboxes.banAllXboxes,
      banAllPCs: this.formControls.checkboxes.banAllPCs,
      deleteLeaderboardEntries: this.formControls.checkboxes.deleteLeaderboardEntries,
    }),
  });

  public options = {
    banArea: BanArea,
  };

  public canSubmit = false;
  public canSubmitDisabledReason = 'N/A';

  public banReasonOptions: Observable<BanReasonGroup[]>;

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    this.banReasonOptions = this.formControls.banReason.valueChanges.pipe(
      startWith(''),
      map((searchValue: string) => {
        if (searchValue) {
          const lowercaseSearchValue = searchValue.toLowerCase();
          return STANDARD_BAN_REASONS.map(g => {
            if (g.group.toLowerCase().startsWith(lowercaseSearchValue)) {
              return g;
            } else {
              const matchingValues = g.values.filter(v =>
                v.toLowerCase().includes(lowercaseSearchValue),
              );
              if (matchingValues.length > 0) {
                return <BanReasonGroup>{ group: g.group, values: matchingValues };
              } else {
                return null;
              }
            }
          }).filter(v => !!v);
        }

        return STANDARD_BAN_REASONS;
      }),
    );
  }

  /** Form control hook. */
  public writeValue(data: { [key: string]: unknown }): void {
    if (data) {
      this.formGroup.setValue(data, { emitEvent: false });
    }
  }

  /** Form control hook. */
  public registerOnChange(fn: (data: BanOptions) => void): void {
    this.formGroup.valueChanges.subscribe(fn);
  }

  /** Form control hook. */
  public registerOnTouched(_fn: () => void): void {
    /** empty */
  }

  /** Form control hook. */
  public setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.formGroup.disable();
    } else {
      this.formGroup.enable();
    }
  }

  /** Form control hook. */
  public validate(_: AbstractControl): ValidationErrors | null {
    if (this.formGroup.valid) {
      return null;
    }

    return { invalidForm: { valid: false, message: 'fields are invalid' } };
  }
}