import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select } from '@ngxs/store';
import { Clipboard } from '@shared/helpers/clipboard';
import { ScrutineerDataParser } from '@shared/helpers/scrutineer-data-parser/scrutineer-data-parser.helper';
import { UserModel } from '@shared/models/user.model';
import { ZendeskService } from '@shared/services/zendesk';
import { UserState } from '@shared/state/user/user.state';
import { ApolloSidebarModel, GravitySidebarModel, SunriseSidebarModel } from 'app/ticket-sidebar/models';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

/** Defines the ticket sidebar component. */
@Component({
    templateUrl: './ticket-sidebar.html',
    styleUrls: ['./ticket-sidebar.scss']
})
export class TicketSidebarComponent implements OnInit, AfterViewInit {
    @Select(UserState.profile) public profile$: Observable<UserModel>;

    public loading: boolean;
    public profile: UserModel;
    public title: string;
    public player: any;
    public gamerTag: string;

    constructor(
        private router: Router,
        private zendeskService: ZendeskService,
        private scrutineerDataParser: ScrutineerDataParser,
        private clipboard: Clipboard
        ) { }

    /** Logic for the OnInit component lifecycle. */
    public ngOnInit() {
        this.loading = true;
        UserState.latestValidProfile(this.profile$).subscribe(
            profile => {
                this.loading = false;
                this.profile = profile;
                if (!this.profile) {
                    this.router.navigate([`/auth`], { queryParams: {from: 'ticket-sidebar'}});
                } else {
                    this.getTicketRequestor();
                }
            },
            error => {
                this.loading = false;
                this.router.navigate([`/auth`], { queryParams: {from: 'ticket-sidebar'}});

            }
        );
    }

    /** Logic for the AfterViewInit component lifecycle. */
    public ngAfterViewInit() {
        this.zendeskService.resize('100%', '500px');
    }

    /** Gets the ticket requestor information. */
    public getTicketRequestor() {
        this.zendeskService.getTicketRequestor().subscribe((response: any) => {
            const requester = response['ticket.requester'];

            // TODO: Check if gamertag was input into the custom ticket field.
            // If it was, use that over the ticket requestor as gamertag lookup.
            this.gamerTag = requester.name;
            this.getTicketFields();
        });
    }

    /** Gets all the ticket's custom fields. */
    public getTicketFields() {
        this.zendeskService.getTicketFields().subscribe((response: any) => {
            const ticketFields = response.ticketFields;
            let titleCustomField = '';
            for (const field in ticketFields) {
                if (ticketFields[field].label === 'Forza Title') {
                    titleCustomField = ticketFields[field].name;
                }
            }
            this.getTitleData(titleCustomField);
        });
    }

    /** Gets title data from ticket. */
    public getTitleData(titleCustomField) {
        this.zendeskService.getTicketCustomField(titleCustomField).subscribe(response => {
            const titleName = response[`ticket.customField:${titleCustomField}`];
            const titleNameUppercase = titleName.toUpperCase();
            this.title = titleNameUppercase ===  'FORZA_STREET' ? 'Gravity'
                : titleNameUppercase ===  'FORZA_HORIZON_4' ? 'Sunrise'
                : titleNameUppercase ===  'FORZA_MOTORSPORT_7' ? 'Apollo'
                : titleNameUppercase ===  'FORZA_HORIZON_3' ? 'Opus'
                : null;


            // TODO: If title is NULL, break out of logic and show error.
            this.getPlayerData();
        });
    }

    /** Requests the player details from API. */
    public getPlayerData() {
        // TODO: Move this away from zendesk request and make it through our own service request
        const settings = {
            url: `${environment.oldScrutineerApiUrl}/Title/${this.title}/environment/Retail/player/gamertag(${this.gamerTag})`,
            headers: { 'Authorization': 'ApiKeyAuth 3diJHuez5u2AysQmTuxc93' },
            secure: false,
            type: 'GET',
            dataType: 'json',
            credentials: 'include'
        };
        this.zendeskService.sendRequest(settings).then(response => {
                this.showUserData(response, null);
            },err =>  {
                // TODO: show error on ticket app.
            });
    }

    /** Parses user data to more readible information. */
    public showUserData(player, customSlotTable) {
        this.player = this.title ===  'Gravity' ? this.reduceToGravityProps(player)
                : this.title ===  'Sunrise' ? this.reduceToSunriseProps(player)
                : this.title ===  'Apollo' ? this.reduceToApolloProps(player)
                : this.title ===  'Opus' ? null
                : null;

        this.player.firstLogin = 'firstLogin' in this.player
            ? this.scrutineerDataParser.convertDateString(this.player.firstLogin) : undefined;
        this.player.lastLogin = 'lastLogin' in this.player ? this.scrutineerDataParser.convertDateString(this.player.lastLogin) : undefined;
        this.player.region = 'region' in this.player
            ? this.title ===  'Apollo'
                ? this.scrutineerDataParser.regionDictFM7(this.player.region)
                : this.scrutineerDataParser.regionDict(this.player.region)
            : undefined;
        this.player.country = 'country' in this.player ? this.scrutineerDataParser.countryDict(this.player.country) : undefined;
        this.player.ageGroup = 'ageGroup' in this.player ? this.scrutineerDataParser.ageGroupDict(this.player.ageGroup) : undefined;
        this.player.lcid = 'lcid' in this.player ? this.scrutineerDataParser.lcid(this.player.lcid) : undefined;
        this.player.flags = 'flags' in this.player ? this.scrutineerDataParser.parseFlags(this.player.flags) : undefined;
        this.player.userAgeGroup = 'userAgeGroup' in this.player
            ? this.scrutineerDataParser.ageGroupDict(this.player.userAgeGroup) : undefined;
    }

    /** Reduces user data to properties needed for a gravity ticket. */
    public reduceToGravityProps(fullPlayerInfo): GravitySidebarModel {
        return {
            xuid: fullPlayerInfo.xuid,
            gamertag: fullPlayerInfo.gamertag,
            firstLogin: fullPlayerInfo.firstLogin,
            lastLogin: fullPlayerInfo.lastLogin,
            region: fullPlayerInfo.region,
            country: fullPlayerInfo.country,
            ipAddress: fullPlayerInfo.ipAddress,
            lcid: fullPlayerInfo.lcid,
            environment: fullPlayerInfo.environment,
            ageGroup: fullPlayerInfo.ageGroup,
            subscriptionTier: fullPlayerInfo.subscriptionTier,
            lastGameSettingsUsed: fullPlayerInfo.lastGameSettingsUsed,
            timeOffsetInSeconds: fullPlayerInfo.timeOffsetInSeconds,
            userInventoryId: fullPlayerInfo.userInventoryId
        };
    }

    /** Reduces user data to properties needed for a sunrise ticket. */
    public reduceToSunriseProps(fullPlayerInfo): SunriseSidebarModel {
        return {
            xuid: fullPlayerInfo.qwXuid,
            gamertag: fullPlayerInfo.wzGamertag,
            region: fullPlayerInfo.region,
            currentCareerLevel: fullPlayerInfo.currentCareerLevel,
            flags: fullPlayerInfo.flags,
            licensePlate: fullPlayerInfo.licensePlate,
            painterThreadLevel: fullPlayerInfo.painterThreadLevel,
            photoThreadLevel: fullPlayerInfo.photoThreadLevel,
            tunerThreadLevel: fullPlayerInfo.tunerThreadLevel,
            blueprintThreadLevel: fullPlayerInfo.blueprintThreadLevel,
            clubId: fullPlayerInfo.clubId,
            clubTag: fullPlayerInfo.clubTag,
            roleInClub: fullPlayerInfo.roleInClub,
            teamId: fullPlayerInfo.teamId,
            teamTag: fullPlayerInfo.teamTag,
            roleInTeam: fullPlayerInfo.roleInTeam,
        };
    }

    /** Reduces user data to properties needed for an apollo ticket. */
    public reduceToApolloProps(fullPlayerInfo): ApolloSidebarModel {
        return {
            xuid: fullPlayerInfo.qwXuid,
            gamertag: fullPlayerInfo.wzGamertag,
            region: fullPlayerInfo.region,
            currentCareerLevel: fullPlayerInfo.currentCareerLevel,
            clubTag: fullPlayerInfo.clubTag,
            roleInClub: fullPlayerInfo.roleInClub,
            firstLogin: fullPlayerInfo.firstLogin,
            lastLogin: fullPlayerInfo.lastLogin,
            country: fullPlayerInfo.country,
            ipAddress: fullPlayerInfo.ipAddress,
            lcid: fullPlayerInfo.lcid,
            ageGroup: fullPlayerInfo.ageGroup,
            subscriptionTier: fullPlayerInfo.subscriptionTier,
            currentBadgeId: fullPlayerInfo.currentBadgeId,
            currentDriverModelId: fullPlayerInfo.currentDriverModelId,
            currentPlayerTitleId: fullPlayerInfo.currentPlayerTitleId,
            equippedVanityItemId: fullPlayerInfo.equippedVanityItemId,
            acceptsClubInvites: fullPlayerInfo.acceptsClubInvites,
            clubTopTierCount: fullPlayerInfo.clubTopTierCount,
            userAgeGroup: fullPlayerInfo.userAgeGroup,
            isFeaturedCommentator: fullPlayerInfo.isFeaturedCommentator,
            isFeaturedDrivatar: fullPlayerInfo.isFeaturedDrivatar,
            isFeaturedPhotographer: fullPlayerInfo.isFeaturedPhotographer,
            isFeaturedTuner: fullPlayerInfo.isFeaturedTuner,
            isFeaturedPainter: fullPlayerInfo.isFeaturedPainter,
            isCommunityManager: fullPlayerInfo.isCommunityManager,
            isUserUnderReview: fullPlayerInfo.isUserUnderReview,
            isOnWhiteList: fullPlayerInfo.isOnWhiteList,
            isTurn10Employee: fullPlayerInfo.isTurn10Employee,
            isVip: fullPlayerInfo.isVip,
        };
    }

    /** Opens up inventory app with predefined info filled out. */
    public goToInventory() {
        const appSection = this.title + '/' + this.player.xuid;
        this.zendeskService.goToApp('nav_bar', 'forza-inventory-support', appSection);
    }

    /** Copies the value to the client clipboard. */
    public copyToClipboard(val: string) {
        this.clipboard.copyMessage(val);
    }
}
