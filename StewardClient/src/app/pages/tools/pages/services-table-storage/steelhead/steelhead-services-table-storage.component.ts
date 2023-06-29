import { Component, forwardRef, Inject } from '@angular/core';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { cloneDeep, first } from 'lodash';
import { GuidLikeString } from '@models/extended-types';
import { ServicesTableStorageComponent } from '../services-table-storage.component';
import {
  ServicesTableStorageEntity,
  SteelheadServicesTableStorageService,
} from '@services/api-v2/steelhead/services-table-storage/services-table-storage.service';
import { Observable } from 'rxjs';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitle } from '@models/enums';
import { ServicesTableStorageContract } from '../components/services-filterable-table/services-filterable-table.component';
import BigNumber from 'bignumber.js';
import { FullPlayerInventoryProfile } from '@models/player-inventory-profile';

/** Component for displaying routed Steelhead user details. */
@Component({
  selector: 'steelhead-services-table-storage',
  templateUrl: './steelhead-services-table-storage.component.html',
  styleUrls: ['./steelhead-services-table-storage.component.scss'],
})
export class SteelheadServicesTableStorageComponent extends BaseComponent {
  public title: GameTitle.FM8;
  public profile: FullPlayerInventoryProfile;
  public data: ServicesTableStorageEntity[] = null;
  public serviceContract: ServicesTableStorageContract;

  /** The lookup type. */
  public get lookupType(): string {
    return this.parent.lookupType ?? '?';
  }

  /** The lookup value. */
  public get lookupName(): string {
    return first(this.parent.lookupList);
  }

  /** The specific relevant identity from the parent. */
  public get identity(): IdentityResultAlpha {
    return this.parent.identity?.steelhead;
  }

  /** A string overview of the profile ids. */
  public get profileOverviewString(): string {
    return `Profile Id: ${this.profile?.profileId} (External Id: ${this.profile?.externalProfileId})`;
  }

  constructor(
    @Inject(forwardRef(() => ServicesTableStorageComponent))
    private parent: ServicesTableStorageComponent,
    private steelheadService: SteelheadServicesTableStorageService,
  ) {
    super();

    this.serviceContract = {
      xuid: this.identity?.xuid,
      externalProfileId: this.profile?.externalProfileId,
      gameTitle: GameTitle.FM8,
      getTableStorageByProfileId$(
        xuid: BigNumber,
        externalProfileId: GuidLikeString,
        filterResults: boolean
      ): Observable<ServicesTableStorageEntity[]> {
        return steelheadService.getTableStorageByProfileId$(xuid, externalProfileId, filterResults);
      },
    };
  }

  /** Called when a new profile is picked. */
  public onProfileChange(newProfile: FullPlayerInventoryProfile): void {
    this.profile = newProfile;
    this.serviceContract.xuid = this.identity.xuid;
    this.serviceContract.externalProfileId = this.profile.externalProfileId;
  }

  /** Called when external profile id changes due to loading/reseting profile. */
  public onExternalProfileIdChange(newExternalProfileId: GuidLikeString): void {
    const tmpProfile = cloneDeep(this.profile);
    tmpProfile.externalProfileId = newExternalProfileId;
    this.profile = tmpProfile;
  }
}
