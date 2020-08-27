import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Select, Store } from "@ngxs/store";
import { UserModel } from "@shared/models/user.model";
import {
  RequestAccessToken,
  ResetUserProfile,
} from "@shared/state/user/user.actions";
import { UserState } from "@shared/state/user/user.state";
import { Observable } from "rxjs";

import { environment } from "../../environments/environment";

/** Defines the sidebar app component. */
@Component({
  templateUrl: "./side-bar.html",
  styleUrls: ["./side-bar.scss"],
})
export class SidebarComponent implements OnInit {
  @Select(UserState.profile) public profile$: Observable<UserModel>;

  public loading: boolean;
  public profile: UserModel;

  constructor(private router: Router) {}

  /** Logic for the OnInit component lifecycle. */
  public ngOnInit() {
    this.loading = true;
    UserState.latestValidProfile(this.profile$).subscribe(
      profile => {
        this.loading = false;
        this.profile = profile;
        if (!this.profile) {
          this.router.navigate([`/auth`], { queryParams: { from: "sidebar" } });
        }
      },
      error => {
        this.loading = false;
        this.router.navigate([`/auth`], { queryParams: { from: "sidebar" } });
      }
    );
  }
}
