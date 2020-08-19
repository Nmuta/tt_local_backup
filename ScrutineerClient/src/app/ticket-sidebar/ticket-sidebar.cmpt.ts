import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ZendeskService } from '@shared/services/zendesk';
import { Clipboard, ScrutineerDataParser } from '@shared/helpers';
import { GravitySidebarModel, SunriseSidebarModel, ApolloSidebarModel } from 'app/ticket-sidebar/models'
import { UserState } from '@shared/state/user/user.state';
import { UserModel } from '@shared/models/user.model';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResetUserProfile, RequestAccessToken } from '@shared/state/user/user.actions';

@Component({
    templateUrl: './ticket-sidebar.html',
    styleUrls: ['./ticket-sidebar.scss']
})
export class TicketSidebarCmpt implements OnInit, AfterViewInit {
    @Select(UserState.profile) profile$: Observable<UserModel>;

    public loading: boolean;
    public profile: UserModel;
    public title: string;
    public player: any;
    public gamerTag: string;
    
    constructor(
        private store: Store,
        private zendeskService: ZendeskService,
        private scrutineerDataParser: ScrutineerDataParser,
        private clipboard: Clipboard
        ) { }

    public ngOnInit() {
        this.loading = true;
        UserState.latestValidProfile(this.profile$).subscribe(
            profile => {
                this.profile = profile;
                this.loading = false;
                this.getTicketRequestor();
            },
            error => {
                this.loading = false;
            }
        );
    }

    public ngAfterViewInit() {
        this.zendeskService.resize("100%", "500px");
    }

    public openAuthPageInNewTab() {
        window.open(`${environment.clientUrl}/auth`, '_blank')
    }

    public recheckAuth() {
        this.store.dispatch(new ResetUserProfile());
        this.store.dispatch(new RequestAccessToken());
        this.ngOnInit();
    }

    public getTicketRequestor() {
        this.zendeskService.getTicketRequestor().subscribe((response: any) => {
            var requester = response['ticket.requester'];
            var organizations =  requester.organizations;
            var requesterName: string = requester.name;
            var orgName: string = null;
            if (organizations.length > 0) {
                orgName = organizations[0].name;
            }

            this.gamerTag = orgName !== 'Mods' ? requesterName : '';
            this.getTicketFields();
        });
    }

    public getTicketFields() {
        this.zendeskService.getTicketFields().subscribe((response: any) => {
            var ticketFields = response["ticketFields"];
            let titleCustomField = "";
            for (let field in ticketFields) {
                if (ticketFields[field].label === "Forza Title") {
                    titleCustomField = ticketFields[field].name;
                }
            }
            this.getTitleData(titleCustomField)
        }); 
    }

    public getTitleData(titleCustomField) {
        this.zendeskService.getTicketCustomField(titleCustomField).subscribe((response) => {
            var titleName = response[`ticket.customField:${titleCustomField}`];
            var titleNameUppercase = titleName.toUpperCase();
            this.title = titleNameUppercase ===  'FORZA_STREET' ? 'Gravity'
                : titleNameUppercase ===  'FORZA_HORIZON_4' ? 'Sunrise'
                : titleNameUppercase ===  'FORZA_MOTORSPORT_7' ? 'Apollo'
                : titleNameUppercase ===  'FORZA_HORIZON_3' ? 'Opus'
                : null;


            // TODO: If title is NULL, break out of logic and show error
            this.getPlayerData();
        }); 
    }

    public getPlayerData() {
        var settings = {
            url: `${environment.oldScrutineerApiUrl}/Title/${this.title}/environment/Retail/player/gamertag(${this.gamerTag})`,
            headers: { "Authorization": "ApiKeyAuth 3diJHuez5u2AysQmTuxc93" },
            secure: false,
            type: "GET",
            dataType: "json",
            credentials: "include"
        };
        this.zendeskService.sendRequest(settings).then(
            (response) => {
                this.showUserData(response, null);
            },
            (err) =>  {
                console.log(err);
            });
    }

    public showUserData(player, customSlotTable) {
        this.player = this.title ===  'Gravity' ? this.reduceToGravityProps(player)
                : this.title ===  'Sunrise' ? this.reduceToSunriseProps(player)
                : this.title ===  'Apollo' ? this.reduceToApolloProps(player)
                : this.title ===  'Opus' ? null
                : null;

        this.player.firstLogin = 'firstLogin' in this.player ? this.scrutineerDataParser.convertDateString(this.player.firstLogin) : undefined;
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
        this.player.userAgeGroup = 'userAgeGroup' in this.player ? this.scrutineerDataParser.ageGroupDict(this.player.userAgeGroup) : undefined;
    }

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

    public goToInventory() {
        var appSection = this.title + '/' + this.player.xuid;
        this.zendeskService.goToApp('nav_bar', 'forza-inventory-support', appSection);
    }

    public copyToClipboard(val: string) {
        this.clipboard.copyMessage(val);
    }
}