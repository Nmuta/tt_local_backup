import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BaseComponent } from '@components/base-component/base-component.component';
import { GameTitleCodeName } from '@models/enums';
import { Select, Store } from '@ngxs/store';
import { UpdateCurrentGiftingPageTitle } from '@shared/state/user/user.actions';
import { UserState } from '@shared/state/user/user.state';
import { Observable } from 'rxjs';
import { delay, filter, takeUntil } from 'rxjs/operators';
import { createNavbarPath, NavbarTools } from '../../navbar-tool-list';

/** The gifting page for the Navbar app. */
@Component({
  selector: 'app-gifting',
  templateUrl: './gifting.component.html',
  styleUrls: ['./gifting.component.scss'],
})
export class GiftingComponent extends BaseComponent implements OnInit {
  @Select(UserState.currentGiftingPageTitle) public currentGiftingPageTitle$: Observable<string>;
  gameTitleOptions = [
    GameTitleCodeName.Street,
    GameTitleCodeName.FH4,
    GameTitleCodeName.FM7,
    GameTitleCodeName.FH3,
  ];
  selectedGameTitle: GameTitleCodeName;
  pageRoute: string = 'gifting';

  constructor(protected store: Store, protected router: Router, protected route: ActivatedRoute) {
    super();
  }

  /** Initialization hook. */
  public ngOnInit(): void {
    // NOTE: As more tools integrate with the title/player selection components
    // we can probably move this logic to the base component and use abstract functions
    // to hookup our obserables to monitor the correct data


    // Inital load needs to handle if game title is already in route
    this.handleInitalGiftingRoute(this.router.url);

    // Watch for gifting title changes and route when found
    this.currentGiftingPageTitle$
      .pipe(takeUntil(this.onDestroy$), delay(0))
      .subscribe((currentGiftingPageTitle: GameTitleCodeName) => {
        this.routeToTitlePage(currentGiftingPageTitle);
      });

    // Navbar gifting route does not point to a game title
    // so we need to handle those button clicks
    this.router.events
      .pipe(
        takeUntil(this.onDestroy$),
        filter(event => event instanceof NavigationEnd),
        filter((event: NavigationEnd) => {
          // Checks if route ends with 'gifting'
          const routePaths = event.url.split('/').filter(x => !!x && x !== '');
          return routePaths[routePaths.length - 1] === this.pageRoute;
        }),
      )
      .subscribe(() => {
        const lastVisitedGameTitle = this.store.selectSnapshot<GameTitleCodeName>(
          UserState.currentGiftingPageTitle,
        );
        this.routeToTitlePage(lastVisitedGameTitle);
      });
  }

  /** Routes to the gifting title page */
  public routeToTitlePage(title: GameTitleCodeName): void {
    this.selectedGameTitle = title;
    this.router.navigate([
      ...createNavbarPath(NavbarTools.GiftingPage).routerLink,
      this.selectedGameTitle.toLowerCase(),
    ]);
  }

  /** Logic when a new game title is selected */
  public newGameTitleSelected(title: GameTitleCodeName): void {
    this.store.dispatch(new UpdateCurrentGiftingPageTitle(title));
  }

  /**
   *  Handles if init gifting page route has a game title in it.
   */
  public handleInitalGiftingRoute(url: string): void {
    const routePaths = url.split('/').filter(x => !!x && x !== '');
    for (let i = 1; i < routePaths.length; i++) {
      // Check one index lower to find if 'gifting' is present
      // When found, game title will be the current index
      if (routePaths[i - 1].toLowerCase() === this.pageRoute) {
        const foundGameTitle = (routePaths[i].charAt(0).toUpperCase() +
          routePaths[i].slice(1)) as GameTitleCodeName;
        this.newGameTitleSelected(foundGameTitle);
      }
    }
  }
}
