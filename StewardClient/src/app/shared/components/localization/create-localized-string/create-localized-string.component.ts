import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { GameTitle, LocalizationCategory } from '@models/enums';
import { LocalizedStringData } from '@models/localization';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { catchError, EMPTY, Observable } from 'rxjs';

export interface CreateLocalizedStringContract {
  gameTitle: GameTitle;
  postLocalizedString$(localizedStringData: LocalizedStringData): Observable<void>;
}

/** Displays the value sent on `input` as a json blob. */
@Component({
  selector: 'create-localized-string',
  templateUrl: './create-localized-string.component.html',
  styleUrls: ['./create-localized-string.component.scss'],
})
export class CreateLocalizedStringComponent {
  @Input() service: CreateLocalizedStringContract

  public postMonitor = new ActionMonitor('POST string for localization');
  public readonly messageMaxLength: number = 512;
  public categoryTypes: string[] = Object.values(LocalizationCategory);

  public formControls = {
    stringToLocalize: new FormControl('', [
      Validators.required,
      Validators.maxLength(this.messageMaxLength),
    ]),
    description: new FormControl('', [Validators.required]),
    category: new FormControl(LocalizationCategory.Unset, [Validators.required]),
  };

  public formGroup = new FormGroup(this.formControls);

  /** Create message */
  public createMessage(): void {
    if (!this.service)
    {
      throw new Error('No service provided for CreateLocalizedStringComponent');
    }
    const stringData : LocalizedStringData = {
      stringToLocalize: this.formControls.stringToLocalize.value,
      description: this.formControls.description.value,
      category: this.formControls.category.value,
    }

    this.postMonitor = this.postMonitor.repeat();

    this.service.postLocalizedString$(stringData)
    .pipe(
      this.postMonitor.monitorSingleFire(),
      catchError(() => {
        return EMPTY;
      }),
    )
    .subscribe(() => {
      this.formControls.stringToLocalize.setValue('');
      this.formControls.description.setValue('');
      this.formControls.category.setValue(LocalizationCategory.Unset)
    });
  }
}