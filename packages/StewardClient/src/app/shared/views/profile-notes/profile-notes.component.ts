import BigNumber from 'bignumber.js';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GameTitle } from '@models/enums';
import { ProfileNote } from '@models/profile-note.model';
import { FormControl, FormGroup } from '@angular/forms';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { BetterSimpleChanges } from '@helpers/simple-changes';

export interface ProfileNotesServiceContract {
  /** Game title the service contract is associated with. */
  gameTitle: GameTitle;
  /** Gets player profile notes. */
  getProfileNotesByXuid$(xuid: BigNumber): Observable<ProfileNote[]>;
  /** Add a profile note to the player by xuid. */
  addProfileNoteByXuid$(xuid: BigNumber, profileNote: string): Observable<void>;
}

/** Base component for displaying user profile notes by XUID. */
@Component({
  selector: 'profile-notes',
  templateUrl: './profile-notes.component.html',
  styleUrls: ['./profile-notes.component.scss'],
})
export class ProfileNotesComponent extends BaseComponent implements OnInit, OnChanges {
  /** The XUID to look up. */
  @Input() xuid: BigNumber;
  /** The cms override service. */
  @Input() service: ProfileNotesServiceContract;

  /** The user's profile notes. */
  public profileNotes: ProfileNote[];

  public displayColumns: string[] = ['date', 'author', 'text'];

  public formControls = {
    note: new FormControl(''),
  };

  public formGroup = new FormGroup(this.formControls);

  public getMonitor = new ActionMonitor('Get player profile notes');
  public postMonitor = new ActionMonitor('Add a player note');

  public readonly permAttribute = PermAttributeName.AddProfileNote;

  /** Gets the service contract game title. */
  public get gameTitle(): GameTitle {
    return this.service.gameTitle;
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    if (!this.service) {
      throw new Error('No service is defined for cms override component.');
    }
  }

  /** Lifecycle hook. */
  public ngOnChanges(changes: BetterSimpleChanges<ProfileNotesComponent>): void {
    if (!changes.xuid) {
      return;
    }

    this.loadProfileNotes();
  }

  /** Add a profile note to the player. */
  public addProfileNote(): void {
    if (!this.xuid || this.xuid.isNaN()) {
      return;
    }

    this.postMonitor = this.postMonitor.repeat();
    this.service
      .addProfileNoteByXuid$(this.xuid, this.formControls.note.value)
      .pipe(this.postMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.loadProfileNotes();
      });
  }

  private loadProfileNotes(): void {
    this.getMonitor = this.getMonitor.repeat();
    const getProfileNotesXuid$ = this.service.getProfileNotesByXuid$(this.xuid);
    getProfileNotesXuid$
      .pipe(this.getMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(notes => {
        this.profileNotes = notes;
      });
  }
}
