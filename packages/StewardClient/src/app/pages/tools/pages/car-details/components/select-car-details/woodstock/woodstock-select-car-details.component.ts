import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '@components/base-component/base.component';
import { NavbarTool } from '@environments/environment';
import { tryParseBigNumber } from '@helpers/bignumbers';
import { getToolsActivatedRoute } from '@helpers/tools-activated-route';
import { GameTitle, PegasusProjectionSlot } from '@models/enums';
import { PathParams } from '@models/path-params';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { MakeModelAutoCompleteFormValue } from '@views/make-model-autocomplete/make-model-autocomplete.base.component';
import BigNumber from 'bignumber.js';
import { skip, takeUntil } from 'rxjs';

/** The Woodstock car details page. */
@Component({
  templateUrl: './woodstock-select-car-details.component.html',
  styleUrls: ['./woodstock-select-car-details.component.scss'],
})
export class WoodstockSelectCarDetailsComponent extends BaseComponent implements OnInit {
  public getActionMonitor = new ActionMonitor('GET car details');
  public preselectedId: BigNumber;
  public readonly pegasusSlotId: PegasusProjectionSlot = PegasusProjectionSlot.LiveSteward;

  public formControls = {
    makeModelSelect: new FormControl(null),
  };

  constructor(private readonly route: ActivatedRoute, private readonly router: Router) {
    super();
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    const carId = this.route.children
      .map(childRoute => {
        const carId = childRoute.snapshot.params[PathParams.CarId];
        return tryParseBigNumber(carId);
      })
      .find(carId => !!carId);

    if (!!carId) {
      this.preselectedId = carId;
    }

    this.formControls.makeModelSelect.valueChanges
      .pipe(
        skip(1), // Ignore form control initialized value
        takeUntil(this.onDestroy$),
      )
      .subscribe((data: MakeModelAutoCompleteFormValue) => {
        const carId = data?.id?.toString() ?? '';

        const toolsRoute = getToolsActivatedRoute(this.route);
        this.router.navigate([NavbarTool.CarDetails, GameTitle.FH5, carId], {
          relativeTo: toolsRoute,
        });
      });
  }
}
