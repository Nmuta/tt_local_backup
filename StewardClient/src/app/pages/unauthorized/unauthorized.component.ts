import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { ActivatedRoute } from '@angular/router';

/** Displays the home page splash page. */
@Component({
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.scss'],
})
export class UnauthorizedComponent extends BaseComponent implements OnInit {
  public appName: string = 'Unknown';

  constructor(private route: ActivatedRoute) {
    super();
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.appName = params['app'];
    });
  }
}
