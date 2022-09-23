import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitle, LocalizationCategory } from '@models/enums';
import { LocalizedStringData } from '@models/localization';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { catchError, EMPTY, Observable, takeUntil } from 'rxjs';

export interface CreateLocalizedStringContract {
  gameTitle: GameTitle;
  postStringForLocalization$(localizedStringData: LocalizedStringData): Observable<void>;
}

/** Displays the value sent on `input` as a json blob. */
@Component({
  selector: 'create-localized-string',
  templateUrl: './create-localized-string.component.html',
  styleUrls: ['./create-localized-string.component.scss'],
})
export class CreateLocalizedStringComponent extends BaseComponent {
  @Input() service: CreateLocalizedStringContract;

  public postMonitor = new ActionMonitor('POST String Localization');
  public readonly messageMaxLength: number = 512;
  public categoryTypes: string[] = Object.values(LocalizationCategory);

  public formControls = {
    stringToLocalize: new FormControl('', [
      Validators.required,
      Validators.maxLength(this.messageMaxLength),
    ]),
    description: new FormControl('', [Validators.required]),
    category: new FormControl(null, [Validators.required]),
  };

  public formGroup = new FormGroup(this.formControls);

  /** Create message */
  public createMessage(): void {
    if (!this.service) {
      throw new Error('No service provided for CreateLocalizedStringComponent');
    }
    const stringData: LocalizedStringData = {
      stringToLocalize: this.formControls.stringToLocalize.value,
      description: this.formControls.description.value,
      category: this.formControls.category.value,
    };

    this.postMonitor = this.postMonitor.repeat();

    this.service
      .postStringForLocalization$(stringData)
      .pipe(
        this.postMonitor.monitorSingleFire(),
        catchError(() => {
          return EMPTY;
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe(() => {
        this.formControls.stringToLocalize.setValue('');
        this.formControls.description.setValue('');
        this.formControls.category.setValue(null);
        this.formGroup.reset();
      });
  }
}
