import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitle, LocalizationCategory, LocalizationSubCategory } from '@models/enums';
import { PullRequest } from '@models/git-operation';
import { LocalizedStringData } from '@models/localization';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { catchError, EMPTY, Observable, takeUntil } from 'rxjs';

export interface CreateLocalizedStringContract {
  gameTitle: GameTitle;
  postStringForLocalization$(localizedStringData: LocalizedStringData): Observable<PullRequest>;
}

/** Displays the value sent on `input` as a json blob. */
@Component({
  selector: 'create-localized-string',
  templateUrl: './create-localized-string.component.html',
  styleUrls: ['./create-localized-string.component.scss'],
})
export class CreateLocalizedStringComponent extends BaseComponent {
  /** The service used tocreate localized text. */
  @Input() service: CreateLocalizedStringContract;

  /** The service used tocreate localized text. */
  @Output() newActivePr = new EventEmitter<PullRequest>();

  public postMonitor = new ActionMonitor('POST String Localization');
  public readonly messageMaxLength: number = 512;
  public categoryTypes: string[] = Object.values(LocalizationCategory);
  public subCategoryTypes: string[] = Object.values(LocalizationSubCategory);

  public formControls = {
    stringToLocalize: new UntypedFormControl('', [
      Validators.required,
      Validators.maxLength(this.messageMaxLength),
    ]),
    description: new UntypedFormControl('', [Validators.required]),
    category: new UntypedFormControl(null, [Validators.required]),
    subCategory: new UntypedFormControl(null, [Validators.required]),
  };

  public formGroup = new UntypedFormGroup(this.formControls);

  public readonly permAttribute = PermAttributeName.AddLocalizedString;

  /** Create message */
  public createMessage(): void {
    if (!this.service) {
      throw new Error('No service provided for CreateLocalizedStringComponent');
    }
    const stringData: LocalizedStringData = {
      textToLocalize: this.formControls.stringToLocalize.value,
      description: this.formControls.description.value,
      category: this.formControls.category.value,
      subCategory: this.formControls.subCategory.value,
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
      .subscribe(pullRequest => {
        this.newActivePr.emit(pullRequest);
        this.formControls.stringToLocalize.setValue('');
        this.formControls.description.setValue('');
        this.formControls.category.setValue(null);
        this.formGroup.reset();
      });
  }
}
