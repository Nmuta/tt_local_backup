import { Component } from '@angular/core';
import { GameTitle } from '@models/enums';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { HumanizePipe } from '@shared/pipes/humanize.pipe';

/** Invalid permissions icon + tooltip. */
@Component({
  selector: 'invalid-permissions',
  templateUrl: './invalid-permissions.component.html',
  styleUrls: ['./invalid-permissions.component.scss'],
  providers: [HumanizePipe],
})
export class InvalidPermissionsComponent {
  public permAttributeName: PermAttributeName;

  public matTooltip = '';

  constructor(private readonly humanizePipe: HumanizePipe) {}

  /** Lifecycle hooks. */
  public setPermissionTooltip(feature: PermAttributeName, title: GameTitle, env: string): void {
    const displayTitle = Object.keys(GameTitle).find(key => GameTitle[key] === title);

    this.matTooltip = `You do not have the permissions to use this feature: ${this.humanizePipe.transform(
      feature,
    )} - ${displayTitle} - ${env}`;
  }
}
