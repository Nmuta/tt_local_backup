import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BaseComponent } from '@components/base-component/base-component.component';
import { GameTitleCodeNames } from '@models/enums';
import { filter, takeUntil } from 'rxjs/operators';
import { createNavbarPath, NavbarTools } from '../../navbar-tool-list';

/** The gifting page for the Navbar app. */
@Component({
  selector: 'app-gifting',
  templateUrl: './gifting.component.html',
  styleUrls: ['./gifting.component.scss'],
})
export class GiftingComponent extends BaseComponent implements OnInit {
  gameTitleOptions = [
    GameTitleCodeNames.Street,
    GameTitleCodeNames.FH4,
    GameTitleCodeNames.FM7,
    GameTitleCodeNames.FH3
  ];
  selectedGameTitle: GameTitleCodeNames;

  constructor(protected router: Router, protected route: ActivatedRoute) {
    super();
  }

  /** Initialization hook. */
  public ngOnInit(): void {
    this.pullGameTitleFromUrlToUpdateDropdown(this.router.url);

    this.router.events.pipe(
      takeUntil(this.onDestroy$),
      filter(event => event instanceof NavigationEnd),
    ).subscribe((navigationEvent: NavigationEnd) => {
        this.pullGameTitleFromUrlToUpdateDropdown(navigationEvent.url);       
    });
  }

  /** Logic when a new game title is selected */
  public newGameTitleSelected(title: GameTitleCodeNames): void {
    this.router.navigate([
      ...createNavbarPath(NavbarTools.GiftingPage).routerLink,
      title.toLowerCase(),
    ]);
  }

  /** Converts the given title string to its Enum value.
   *  Returns true if URL had game title in route.
   */
  public pullGameTitleFromUrlToUpdateDropdown(url: string): void {
    const routePaths = url.split('/');
    for (let i = 1; i < routePaths.length; i++) {
      if(routePaths[i-1].toLowerCase() === 'gifting') {
        this.selectedGameTitle = (routePaths[i].charAt(0).toUpperCase() + routePaths[i].slice(1)) as GameTitleCodeNames;
        return;
      }
    }
    this.selectedGameTitle = undefined;
  }
}
