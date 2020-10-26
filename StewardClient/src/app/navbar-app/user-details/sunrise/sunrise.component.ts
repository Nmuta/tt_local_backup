import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '@components/base-component/base-component.component';
import { takeUntil } from 'rxjs/operators';

/** Component for displaying routed Sunrise user details. */
@Component({
  selector: 'app-sunrise',
  templateUrl: './sunrise.component.html',
  styleUrls: ['./sunrise.component.scss']
})
export class SunriseComponent extends BaseComponent implements OnInit {
  public gamertag: string;

  constructor(private readonly route: ActivatedRoute) {
    super();
  }

  /** Initialization hook. */
  public ngOnInit(): void {
    this.route.queryParamMap.pipe(takeUntil(this.onDestroy$))
      .subscribe(params => {
        this.gamertag = params.get('gamertag');
        console.log("GAMERTAG", this.gamertag)
      });
  }

}
