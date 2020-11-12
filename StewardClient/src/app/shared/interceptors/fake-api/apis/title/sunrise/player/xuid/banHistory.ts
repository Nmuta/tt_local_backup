import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { SunriseBanHistory } from '@models/sunrise/sunrise-ban-history.model';
import { Unprocessed } from '@models/unprocessed';

/** Fake API for finding User Flags. */
export class SunrisePlayerXuidBanHistoryFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(
      environment.stewardApiUrl,
    );
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /\/?api\/v2\/title\/sunrise\/player\/xuid\((\d+)\)\/banHistory/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): Unprocessed<SunriseBanHistory> {
    return SunrisePlayerXuidBanHistoryFakeApi.make();
  }

  /** Creates a sample object. */
  public static make(): Unprocessed<SunriseBanHistory> {
    return {
      servicesBanHistory: [
        {
          xuid: 2533275026603041,
          isActive: true,
          countOfTimesExtended: 0,
          lastExtendedTimeUtc: '0001-01-01T00:00:00Z',
          lastExtendedReason: null,
          reason: 'Illegitimately obtaining the Owens McLaren',
          featureArea: 'AllRequests',
          startTimeUtc: '2020-10-22T14:53:08.869Z',
          expireTimeUtc: '2040-10-22T14:52:16.439Z',
        },
      ],
      liveOpsBanHistory: [
        {
          startTimeUtc: '2020-10-22T14:53:08.869Z',
          expireTimeUtc: '2040-10-22T14:52:16.439Z',
          xuid: 2533275026603041,
          title: 'Sunrise',
          requestingAgent: 'bonny.paz@microsoft.com',
          featureArea: 'AllRequests',
          reason: 'Illegitimately obtaining the Owens McLaren',
          banParameters:
            '{"Xuids":[2535427874527387,2533275026603041,2535440473151046,2535448245413369,2535463961630870,2535473425460502,2535419734896709,2535438591116803,2535421817521264,2533274900775104,2535418417524452,2535440611583730,2535460116162539,2535433682104606,2533274887596259,2535456387515655,2535417605075824,2535425117447185,2535469806902888,2535440508350313,2535438143615685,2535443018879811,2535470012340737,2535412155378911,2535415951477410,2535440927386611,2535460878577153,2535427684917441,2535430447740472,2535467934693550,2535438235060491,2535465301334206,2535430012774161,2535461770573600,2535437647841554,2535453475553218,2535468601667714,2533274984207591],"Gamertags":null,"BanAllConsoles":false,"BanAllPCs":true,"DeleteLeaderboardEntries":true,"SendReasonNotification":true,"Reason":"Illegitimately obtaining the Owens McLaren","FeatureArea":"AllRequests","StartTimeUtc":"2020-10-22T14:53:08.869Z","ExpireTimeUtc":"2040-10-22T14:52:16.439Z"}',
        },
      ],
    };
  }
}
