import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { icon } from '@fortawesome/fontawesome-svg-core';
import {
  faArrowCircleRight,
  faCheck,
  faCheckCircle,
  faCog,
  faCopy,
  faDownload,
  faEllipsisV,
  faExclamationCircle,
  faExclamationTriangle,
  faEye,
  faEyeSlash,
  faGavel,
  faHistory,
  faInfoCircle,
  faMinus,
  faPassport,
  faPencilAlt,
  faPlus,
  faShieldAlt,
  faSyncAlt,
  faTasks,
  faTimes,
  faTimesCircle,
  faTrashAlt,
  faUndo,
  faUser,
  faUserCheck,
  faUserSlash,
} from '@fortawesome/free-solid-svg-icons';

/** Defines the api service. */
@Injectable({
  providedIn: 'root',
})
export class MatIconRegistryService {
  constructor(
    private readonly registry: MatIconRegistry,
    private readonly sanitizer: DomSanitizer,
  ) {}

  /** Initializes the mat icon registry */
  public initialize(): void {
    this.registry
      .addSvgIconLiteral('steward-edit', this.getFaIconPath(faPencilAlt))
      .addSvgIconLiteral('steward-gavel', this.getFaIconPath(faGavel))
      .addSvgIconLiteral('steward-unacceptable', this.getFaIconPath(faExclamationCircle))
      .addSvgIconLiteral('steward-trash', this.getFaIconPath(faTrashAlt))
      .addSvgIconLiteral('steward-arrow-right', this.getFaIconPath(faArrowCircleRight))
      .addSvgIconLiteral('steward-warning', this.getFaIconPath(faExclamationTriangle))
      .addSvgIconLiteral('steward-refresh', this.getFaIconPath(faSyncAlt))
      .addSvgIconLiteral('steward-info', this.getFaIconPath(faInfoCircle))
      .addSvgIconLiteral('steward-ellipsis', this.getFaIconPath(faEllipsisV))
      .addSvgIconLiteral('steward-settings', this.getFaIconPath(faCog))
      .addSvgIconLiteral('steward-profile', this.getFaIconPath(faUser))
      .addSvgIconLiteral('steward-plus', this.getFaIconPath(faPlus))
      .addSvgIconLiteral('steward-minus', this.getFaIconPath(faMinus))
      .addSvgIconLiteral('steward-copy', this.getFaIconPath(faCopy))
      .addSvgIconLiteral('steward-history', this.getFaIconPath(faHistory))
      .addSvgIconLiteral('steward-download', this.getFaIconPath(faDownload))
      .addSvgIconLiteral('steward-approve', this.getFaIconPath(faCheck))
      .addSvgIconLiteral('steward-close', this.getFaIconPath(faTimes))
      .addSvgIconLiteral('steward-approve-circle', this.getFaIconPath(faCheckCircle))
      .addSvgIconLiteral('steward-close-circle', this.getFaIconPath(faTimesCircle))
      .addSvgIconLiteral('steward-notifications', this.getFaIconPath(faTasks))
      .addSvgIconLiteral('steward-user-check', this.getFaIconPath(faUserCheck))
      .addSvgIconLiteral('steward-user-slash', this.getFaIconPath(faUserSlash))
      .addSvgIconLiteral('steward-passport', this.getFaIconPath(faPassport))
      .addSvgIconLiteral('steward-seen', this.getFaIconPath(faEye))
      .addSvgIconLiteral('steward-unseen', this.getFaIconPath(faEyeSlash))
      .addSvgIconLiteral('steward-undo', this.getFaIconPath(faUndo))
      .addSvgIconLiteral('steward-shield', this.getFaIconPath(faShieldAlt));
  }

  /** Generates a svg html string of a font awesome icon.  */
  private getFaIconPath(faIcon: IconDefinition): SafeHtml {
    const iconToAdd = icon(faIcon).html.join('');
    return this.sanitizer.bypassSecurityTrustHtml(iconToAdd);
  }
}
