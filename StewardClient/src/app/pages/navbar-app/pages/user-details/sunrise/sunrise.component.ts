import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '@components/base-component/base-component.component';
import { SunrisePlayerDetails } from '@models/sunrise';
import { SunriseService } from '@services/sunrise/sunrise.service';
import { NEVER } from 'rxjs';
import { catchError, map, switchMap, takeUntil, tap } from 'rxjs/operators';

/** Component for displaying routed Sunrise user details. */
@Component({
  selector: 'app-sunrise',
  templateUrl: './sunrise.component.html',
  styleUrls: ['./sunrise.component.scss'],
})
export class SunriseComponent extends BaseComponent implements OnInit {
  public gamertag: string;
  public userDetails: SunrisePlayerDetails;
  public xuid: BigInt;
  public error: unknown;

  constructor(private readonly route: ActivatedRoute, private readonly sunrise: SunriseService) {
    super();
  }

  /** Initialization hook. */
  public ngOnInit(): void {
    this.route.queryParamMap
      .pipe(
        tap(_params => {
          debugger;
        }),
        takeUntil(this.onDestroy$),
        map(params => params.get('gamertag')),
        tap(gamertag => {
          this.gamertag = gamertag;
          this.xuid = undefined;
          this.error = undefined;
          this.userDetails = undefined;
        }),
        switchMap(gamertag => {
          return this.sunrise.getPlayerDetailsByGamertag(gamertag).pipe(
            catchError(error => {
              this.error = error;
              return NEVER;
            }),
          );
        }),
      )
      .subscribe(userDetailsResponse => {
        this.userDetails = userDetailsResponse; // TODO: Delete this. Testing only.
        this.xuid = userDetailsResponse.xuid;
      });
  }
}
