import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '@components/base-component/base-component.component';
import { IdentityQueryAlphaIntersection, IdentityResultAlpha, makeAlphaQuery } from '@models/identity-query.model';
import { SunrisePlayerDetails } from '@models/sunrise';
import { SunriseService } from '@services/sunrise/sunrise.service';
import { NEVER } from 'rxjs';
import { catchError, filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';

/** Component for displaying routed Sunrise user details. */
@Component({
  templateUrl: './sunrise.component.html',
  styleUrls: ['./sunrise.component.scss'],
})
export class SunriseComponent extends BaseComponent implements OnInit {
  public gamertag: string;
  public userDetails: SunrisePlayerDetails;
  public xuid: bigint;
  public error: unknown;
  public identity: IdentityResultAlpha;

  constructor(private readonly route: ActivatedRoute, private readonly sunrise: SunriseService) {
    super();
  }

  /** Initialization hook. */
  public ngOnInit(): void {
    this.route.queryParamMap
      .pipe(
        takeUntil(this.onDestroy$),
        filter(params => params.has('lookupType') && params.has('lookupName')),
        map(params => {
          return { type: params.get('lookupType') as keyof IdentityQueryAlphaIntersection, name: params.get('lookupName') };
        }),
        tap(bundle => {
          this.gamertag = undefined;
          this.xuid = undefined;
          this.error = undefined;
          this.userDetails = undefined;
          switch (bundle.type.toLowerCase()) {
            case 'xuid':
              this.xuid = BigInt(bundle.name);
              break;
            case 'gamertag':
              this.gamertag = bundle.name;
              break;
            default:
              break;
          }
        }),
        switchMap(bundle => {
          // TODO: Cache the results of getPlayerIdentity (https://dev.azure.com/t10motorsport/Motorsport/_workitems/edit/646007)
          const query = makeAlphaQuery(bundle.type as keyof IdentityQueryAlphaIntersection, bundle.name)
          return this.sunrise.getPlayerIdentity(query);
        }),
        tap(identity => {
          this.identity = identity;
        }),
        switchMap(identity => {
          return this.sunrise.getPlayerDetailsByXuid(identity.xuid).pipe(
            catchError(error => {
              this.error = error;
              return NEVER;
            }),
          );
        }),
      )
      .subscribe(userDetailsResponse => {
        this.userDetails = userDetailsResponse;
        this.xuid = userDetailsResponse.xuid;
      });
  }
}
