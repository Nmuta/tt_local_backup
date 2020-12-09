import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GravityGiftingState } from './state/gravity-gifting.state';
import { SetSelectedPlayerIdentities } from './state/gravity-gifting.state.actions';

/** The gravity gifting page for the Navbar app. */
@Component({
  templateUrl: './gravity-gifting.component.html',
  styleUrls: ['./gravity-gifting.component.scss'],
})
export class GravityGiftingComponent extends BaseComponent implements OnInit {
  // selectedPlayerIdentities$: Observable<unknown[]> = this.store.select(GravityGiftingState.selectedPlayerIdentities);
  @Select(GravityGiftingState.selectedPlayerIdentities) public selectedPlayerIdentities$: Observable<unknown[]>;

  selectedPlayerIdentities: unknown[];


  constructor(protected store: Store) {
    super();
  }

  /** Initialization hook */
  public ngOnInit(): void {
    this.selectedPlayerIdentities$.pipe(
      takeUntil(this.onDestroy$)
    ).subscribe((playerIdentities: unknown[]) => {
      this.selectedPlayerIdentities = playerIdentities;
    });
  }

  /** Logic when player selection outputs identities. */
  public selectedPlayerIndentities(event: unknown[]): void {
    this.store.dispatch(new SetSelectedPlayerIdentities(event));
  }


}
