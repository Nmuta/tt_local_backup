import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { UserModel } from '@models/user.model';
import { Select, Store } from '@ngxs/store';
import { MsTeamsService } from '@services/api-v2/ms-teams/ms-teams.service';
import { V2UsersService } from '@services/api-v2/users/users.service';
import { EmailAddresses } from '@shared/constants';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { UserState } from '@shared/state/user/user.state';
import { Observable, switchMap, takeUntil } from 'rxjs';

enum RequestType {
  Feature,
  Bug,
  Permission,
  Question,
}

enum RequestImpact {
  Low = 'Low',
  High = 'High',
}

/** A feature request for Steward. */
export type FeatureRequest = {
  title: string;
  description: string;
  isBusinessCritital: boolean;
  internalImpact: string;
  externalImpact: string;
};

/** A bug report for Steward. */
export type BugReport = {
  title: string;
  description: string;
  isBusinessCritital: boolean;
  internalImpact: string;
  externalImpact: string;
  reproductionSteps: string;
  hasWorkaround: boolean;
};

/** A permission request for Steward. */
export type PermissionRequest = {
  permission: string;
  titles: string;
  environments: string;
  justification: string;
};

/** A question for the Steward team. */
export type Question = {
  question: string;
};

/** Component for handling "Contact Us" forms. */
@Component({
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
})
export class ContactUsComponent extends BaseComponent implements OnInit {
  @Select(UserState.profile) public profile$: Observable<UserModel>;

  private readonly stewardTeamContacts: string[] = [
    'luke.geiken@microsoft.com',
    'madden.osei@microsoft.com',
    'jordan.yates@turn10.msgamestudios.com',
    'sharerdavid@microsoft.com',
    'caleb.moore@microsoft.com',
    'v-blebois@microsoft.com',
    'ellen.porter@microsoft.com',
    'stephen.edmonds@playground-games.com',
    'v-charlesyan@microsoft.com',
  ];

  public readonly teamsHelpChannel =
    'https://teams.microsoft.com/l/channel/19%3ada7d498f9e0941f0842a1aa17d2f3127%40thread.tacv2/Contact%2520Us?groupId=041c1fd8-9880-4947-9f7e-bfde634c48cd&tenantId=72f988bf-86f1-41af-91ab-2d7cd011db47';

  public selectedRequestType = null;
  public isSubmitted = false;
  public userProfile: UserModel;
  public teamLead: UserModel;
  public RequestType = RequestType;
  public RequestImpact = RequestImpact;
  public submitReportMonitor = new ActionMonitor('Submit bug/feature');
  public getTeamLeadMonitor = new ActionMonitor(`GET user's team lead`);

  public defaultFeature: FeatureRequest = {
    title: '',
    description: '',
    isBusinessCritital: false,
    internalImpact: RequestImpact.Low,
    externalImpact: RequestImpact.Low,
  };
  public formControlsFeature = {
    title: new UntypedFormControl('', [Validators.required, Validators.maxLength(100)]),
    description: new UntypedFormControl('', [Validators.required]),
    isBusinessCritital: new UntypedFormControl(false, [Validators.required]),
    internalImpact: new UntypedFormControl(RequestImpact.Low, [Validators.required]),
    externalImpact: new UntypedFormControl(RequestImpact.Low, [Validators.required]),
  };
  public formGroupFeature = new UntypedFormGroup(this.formControlsFeature);

  public defaultBug: BugReport = {
    ...this.defaultFeature,
    hasWorkaround: false,
    reproductionSteps: '',
  };
  public formControlsBug = {
    title: new UntypedFormControl('', [Validators.required, Validators.maxLength(100)]),
    description: new UntypedFormControl('', [Validators.required]),
    reproductionSteps: new UntypedFormControl('', [Validators.required]),
    isBusinessCritital: new UntypedFormControl(false, [Validators.required]),
    internalImpact: new UntypedFormControl(RequestImpact.Low, [Validators.required]),
    externalImpact: new UntypedFormControl(RequestImpact.Low, [Validators.required]),
    hasWorkaround: new UntypedFormControl(false, [Validators.required]),
  };
  public formGroupBug = new UntypedFormGroup(this.formControlsBug);

  public defaultPermission: PermissionRequest = {
    permission: '',
    titles: '',
    environments: '',
    justification: '',
  };
  public formControlsPermission = {
    permission: new UntypedFormControl('', [Validators.required]),
    titles: new UntypedFormControl('', [Validators.required]),
    environments: new UntypedFormControl('', [Validators.required]),
    justification: new UntypedFormControl('', [Validators.required]),
  };
  public formGroupPermission = new UntypedFormGroup(this.formControlsPermission);

  public defaultQuestion: Question = {
    question: '',
  };
  public formControlsQuestion = {
    question: new UntypedFormControl('', [Validators.required]),
  };
  public formGroupQuestion = new UntypedFormGroup(this.formControlsQuestion);

  public readonly adminTeamLead = 'Live Ops Admins';
  public readonly adminTeamLeadEmail = EmailAddresses.LiveOpsAdmins;

  constructor(
    protected readonly store: Store,
    private readonly v2UsersService: V2UsersService,
    private readonly msTeamsService: MsTeamsService,
  ) {
    super();
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    UserState.latestValidProfile$(this.profile$)
      .pipe(
        switchMap(user => {
          this.userProfile = user;
          return this.v2UsersService.getTeamLead$(user.objectId);
        }),
        this.getTeamLeadMonitor.monitorSingleFire(),
        takeUntil(this.onDestroy$),
      )
      .subscribe(teamLead => {
        this.teamLead = teamLead;
      });
  }

  /** Submit bug request. */
  public submitBug(): void {
    const bugReport: BugReport = {
      title: this.formControlsBug.title.value,
      description: this.formControlsBug.description.value,
      isBusinessCritital: this.formControlsBug.isBusinessCritital.value,
      internalImpact: this.formControlsBug.internalImpact.value,
      externalImpact: this.formControlsBug.externalImpact.value,
      reproductionSteps: this.formControlsBug.reproductionSteps.value,
      hasWorkaround: this.formControlsBug.hasWorkaround.value,
    };

    this.submitReportMonitor = this.submitReportMonitor.repeat();
    this.msTeamsService
      .sendBugReportMessage$(bugReport)
      .pipe(this.submitReportMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.isSubmitted = true;
      });
  }

  /** Submit feature request. */
  public submitFeature(): void {
    const featureRequest: FeatureRequest = {
      title: this.formControlsFeature.title.value,
      description: this.formControlsFeature.description.value,
      isBusinessCritital: this.formControlsFeature.isBusinessCritital.value,
      internalImpact: this.formControlsFeature.internalImpact.value,
      externalImpact: this.formControlsFeature.externalImpact.value,
    };

    this.submitReportMonitor = this.submitReportMonitor.repeat();
    this.msTeamsService
      .sendFeatureRequestMessage$(featureRequest)
      .pipe(this.submitReportMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.isSubmitted = true;
      });
  }

  /** Submit permission request. */
  public submitPermission(): void {
    const permissionRequest: PermissionRequest = {
      permission: this.formControlsPermission.permission.value,
      titles: this.formControlsPermission.titles.value,
      environments: this.formControlsPermission.environments.value,
      justification: this.formControlsPermission.justification.value,
    };

    this.submitReportMonitor = this.submitReportMonitor.repeat();
    this.msTeamsService
      .sendPermissionRequestMessage$(permissionRequest)
      .pipe(this.submitReportMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.isSubmitted = true;
      });
  }

  /** Submit permission request. */
  public submitQuestion(): void {
    const question: Question = {
      question: this.formControlsQuestion.question.value,
    };

    this.submitReportMonitor = this.submitReportMonitor.repeat();
    this.msTeamsService
      .sendQuestionMessage$(question)
      .pipe(this.submitReportMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.isSubmitted = true;
      });
  }

  /** Reset the contact us form. */
  public resetForm(): void {
    this.formGroupBug.setValue(this.defaultBug);
    this.formGroupFeature.setValue(this.defaultFeature);
    this.formGroupPermission.setValue(this.defaultPermission);
    this.formGroupQuestion.setValue(this.defaultQuestion);
    this.isSubmitted = false;
  }
}
