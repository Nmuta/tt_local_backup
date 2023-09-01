import { Component, forwardRef, OnInit } from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  UntypedFormControl,
  UntypedFormGroup,
  UntypedFormArray,
  ControlValueAccessor,
  Validator,
  AbstractControl,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { collectErrors } from '@helpers/form-group-collect-errors';
import { PrincipalRole, PrincipalType } from '@models/pipelines/obligation-principal';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { chain, cloneDeep, toPairs } from 'lodash';
import { BehaviorSubject } from 'rxjs';

export interface ObligationPrincipalOptions {
  principalType: PrincipalType;
  role: PrincipalRole;
  principalValue: string;
}

export type ObligationPrincipalsOptions = ObligationPrincipalOptions[];

/** A form component for creating a variable number of ObligationPrincipals. */
@Component({
  selector: 'obligation-principals',
  templateUrl: './obligation-principals.component.html',
  styleUrls: ['./obligation-principals.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ObligationPrincipalsComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ObligationPrincipalsComponent),
      multi: true,
    },
  ],
})
export class ObligationPrincipalsComponent
  extends BaseComponent
  implements ControlValueAccessor, Validator, OnInit
{
  public static readonly defaultsSingle: ObligationPrincipalOptions = {
    principalType: PrincipalType.User,
    principalValue: '',
    role: PrincipalRole.Reader,
  };

  public static readonly defaultsAll: ObligationPrincipalsOptions = [
    cloneDeep(ObligationPrincipalsComponent.defaultsSingle),
  ];

  public data: ObligationPrincipalOptions[] = [
    cloneDeep(ObligationPrincipalsComponent.defaultsSingle),
  ];
  public dataSource$ = new BehaviorSubject<AbstractControl[]>([]);
  public displayColumns = ['type', 'role', 'value', 'actions'];

  public rows = new UntypedFormArray([]);

  public PrincipalType = PrincipalType;
  public principalTypeOptions = toPairs(PrincipalType).map(v => {
    return { name: v[0], value: v[1] };
  });
  public principalTypeNameMap = chain(PrincipalType)
    .toPairs()
    .map(v => [v[1], v[0]])
    .fromPairs()
    .value();

  public principalRoleOptions = toPairs(PrincipalRole).map(v => {
    return { name: v[0], value: v[1] };
  });
  public principalRoleNameMap = chain(PrincipalRole)
    .toPairs()
    .map(v => [v[1], v[0]])
    .fromPairs()
    .value();

  // NOTE: This is just a container object becuase FormArray must be contained within one.
  // NOTE: Normally, the contents of this would be used for the output type,
  // NOTE: but in this case, the output type is the FormArray contents.
  public formGroup = new UntypedFormGroup({
    rows: this.rows,
  });

  public readonly permAttribute = PermAttributeName.UpdateObligationPipeline;

  constructor() {
    super();
    this.onDestroy$.subscribe(() => this.dataSource$.complete());
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    this.data.forEach((d: ObligationPrincipalOptions) => this.addRow(d, false));
    this.updateView();
  }

  /** Gets a specific form group. */
  public getFormGroup(arrayIndex: number): UntypedFormGroup {
    return this.rows.get(`${arrayIndex}`) as UntypedFormGroup;
  }

  /** Gets a specific form group. */
  public getFormControl(
    arrayIndex: number,
    controlName: keyof ObligationPrincipalOptions,
  ): UntypedFormControl {
    return this.getFormGroup(arrayIndex)?.get(controlName) as UntypedFormControl;
  }

  /** Clears the table. */
  public emptyTable(): void {
    while (this.rows.length !== 0) {
      this.rows.removeAt(0);
    }
  }

  /** Form control hook. */
  public writeValue(data: ObligationPrincipalsOptions): void {
    if (data) {
      if (data.length !== this.rows.length || data !== this.data) {
        // if the list actually changed, we need to recreate the array
        this.overrideList(data);
        this.rows.valueChanges.subscribe(this.changeFn);
      } else {
        // otherwise we can just patch the existing array
        this.rows.patchValue(data, { emitEvent: false });
      }
    }
  }

  /** Form control hook. */
  public registerOnChange(fn: (data: ObligationPrincipalsOptions) => void): void {
    this.changeFn = fn;
    this.rows.valueChanges.subscribe(this.changeFn);
    this.changeFn(this.rows.value);
  }

  /** Form control hook. */
  public registerOnTouched(_fn: () => void): void {
    /** empty */
  }

  /** Form control hook. */
  public setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.rows.disable();
    } else {
      this.rows.enable();
    }
  }

  /** Form control hook. */
  public validate(_: AbstractControl): ValidationErrors | null {
    if (this.rows.invalid) {
      return collectErrors(this.rows);
    }

    return null;
  }

  /** Called when the "delete" button is clicked. */
  public removeRow(i: number): void {
    this.rows.removeAt(i);
    this.data.splice(i, 1);
    this.updateView();
  }

  /** Called when the "add" button is clicked. */
  public addRow(d?: ObligationPrincipalOptions, noUpdate?: boolean): void {
    const newFormGroup = this.valueToFormGroup(
      cloneDeep(ObligationPrincipalsComponent.defaultsSingle),
    );
    this.rows.push(newFormGroup);
    if (!noUpdate) {
      this.updateView();
    }
  }

  /** Overrides the list when a new list is created. */
  private overrideList(options: ObligationPrincipalsOptions): void {
    this.data = options;
    const groups = options.map(v => this.valueToFormGroup(v));
    this.rows = new UntypedFormArray(groups);
    this.formGroup = new UntypedFormGroup({ rows: this.rows });
    this.updateView();
  }

  private valueToFormGroup(v: ObligationPrincipalOptions): UntypedFormGroup {
    return new UntypedFormGroup({
      principalType: new UntypedFormControl(v.principalType, [Validators.required]),
      principalValue: new UntypedFormControl(v.principalValue, [Validators.required]),
      role: new UntypedFormControl(v.role, [Validators.required]),
    });
  }

  /** Called when the controls have changed. */
  private updateView(): void {
    this.dataSource$.next(this.rows.controls);
  }

  /** The registered callback function. Form control hook. */
  private changeFn = (_data: ObligationPrincipalsOptions) => {
    /* Empty */
  };
}
