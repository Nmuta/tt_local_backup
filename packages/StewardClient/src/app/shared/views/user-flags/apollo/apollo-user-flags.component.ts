import BigNumber from 'bignumber.js';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { UserFlagsBaseComponent } from '../user-flags.base.component';
import { GameTitle } from '@models/enums';
import { ApolloService } from '@services/apollo';
import { ApolloUserFlags } from '@models/apollo';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { OldPermissionsService } from '@services/old-permissions';

/** Retreives and displays Sunrise User Flags by XUID. */
@Component({
  selector: 'apollo-user-flags',
  templateUrl: '../user-flags.component.html',
  styleUrls: ['../user-flags.component.scss'],
})
export class ApolloUserFlagsComponent extends UserFlagsBaseComponent<ApolloUserFlags> {
  public gameTitle = GameTitle.FM7;

  public formControls = {
    isVip: new UntypedFormControl(false),
    isTurn10Employee: new UntypedFormControl(false),
    isEarlyAccess: new UntypedFormControl(false),
    isUnderReview: new UntypedFormControl(false),
  };

  public formGroup = new UntypedFormGroup(this.formControls);

  constructor(
    private readonly apolloService: ApolloService,
    permissionsService: OldPermissionsService,
  ) {
    super(permissionsService);
  }

  /** Gets Apollo user flags. */
  public getFlagsByXuid$(xuid: BigNumber): Observable<ApolloUserFlags> {
    return this.apolloService.getFlagsByXuid$(xuid);
  }

  /** Sets the newly selected Apollo flags. */
  public putFlagsByXuid$(xuid: BigNumber): Observable<ApolloUserFlags> {
    return this.apolloService.putFlagsByXuid$(xuid, {
      isVip: this.formControls.isVip.value,
      isTurn10Employee: this.formControls.isTurn10Employee.value,
      isEarlyAccess: this.formControls.isEarlyAccess.value,
      isUnderReview: this.formControls.isUnderReview.value,
    } as ApolloUserFlags);
  }
}
