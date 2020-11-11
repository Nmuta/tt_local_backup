import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { SunriseCreditHistory } from '@models/sunrise/sunrise-credit-history.model';
import { Unprocessed } from '@models/unprocessed';

/** Fake API for finding User Flags. */
export class SunrisePlayerXuidCreditUpdatesFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(
      environment.stewardApiUrl
    );
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /\/?api\/v2\/title\/sunrise\/player\/xuid\((\d+)\)\/creditUpdates/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): Unprocessed<SunriseCreditHistory> {
    return SunrisePlayerXuidCreditUpdatesFakeApi.makeMany();
  }

  /** Creates a sample response. */
  public static makeMany(): Unprocessed<SunriseCreditHistory> {
    return [
      {
        eventTimestampUtc: '2020-06-19T00:33:10.117Z',
        deviceType: 'UWP',
        creditsAfter: 26708,
        creditAmount: 6708,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 600,
      },
      {
        eventTimestampUtc: '2020-06-19T00:43:57.752Z',
        deviceType: 'UWP',
        creditsAfter: 31918,
        creditAmount: 5210,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 3374,
      },
      {
        eventTimestampUtc: '2020-06-19T00:43:57.752Z',
        deviceType: 'UWP',
        creditsAfter: 41918,
        creditAmount: 10000,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 5528,
      },
      {
        eventTimestampUtc: '2020-06-19T00:50:46.878Z',
        deviceType: 'UWP',
        creditsAfter: 46717,
        creditAmount: 4799,
        sceneName: 'BucketListFinishResult',
        totalXp: 5528,
      },
      {
        eventTimestampUtc: '2020-06-19T00:50:46.879Z',
        deviceType: 'UWP',
        creditsAfter: 56717,
        creditAmount: 10000,
        sceneName: 'BucketListFinishResult',
        totalXp: 13028,
      },
      {
        eventTimestampUtc: '2020-06-19T00:54:49.09Z',
        deviceType: 'UWP',
        creditsAfter: 66717,
        creditAmount: 10000,
        sceneName: 'Hud',
        totalXp: 13628,
      },
      {
        eventTimestampUtc: '2020-06-19T00:59:11.69Z',
        deviceType: 'UWP',
        creditsAfter: 74669,
        creditAmount: 7952,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 13628,
      },
      {
        eventTimestampUtc: '2020-06-19T00:59:32.294Z',
        deviceType: 'UWP',
        creditsAfter: 89669,
        creditAmount: 15000,
        sceneName: 'PostRaceTombola',
        totalXp: 17155,
      },
      {
        eventTimestampUtc: '2020-06-19T01:19:46.23Z',
        deviceType: 'UWP',
        creditsAfter: 97767,
        creditAmount: 8098,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 17155,
      },
      {
        eventTimestampUtc: '2020-06-19T01:19:46.231Z',
        deviceType: 'UWP',
        creditsAfter: 107767,
        creditAmount: 10000,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 20532,
      },
      {
        eventTimestampUtc: '2020-06-25T00:17:39.476Z',
        deviceType: 'UWP',
        creditsAfter: 112985,
        creditAmount: 5218,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 20532,
      },
      {
        eventTimestampUtc: '2020-06-25T00:17:39.476Z',
        deviceType: 'UWP',
        creditsAfter: 112985,
        creditAmount: 5218,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 20532,
      },
      {
        eventTimestampUtc: '2020-06-25T00:17:39.476Z',
        deviceType: 'UWP',
        creditsAfter: 112985,
        creditAmount: 5218,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 20532,
      },
      {
        eventTimestampUtc: '2020-06-25T00:34:51.496Z',
        deviceType: 'UWP',
        creditsAfter: 131286,
        creditAmount: 10000,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 27886,
      },
      {
        eventTimestampUtc: '2020-06-25T00:34:51.496Z',
        deviceType: 'UWP',
        creditsAfter: 121286,
        creditAmount: 8301,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 24500,
      },
      {
        eventTimestampUtc: '2020-06-25T00:34:51.496Z',
        deviceType: 'UWP',
        creditsAfter: 121286,
        creditAmount: 8301,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 24500,
      },
      {
        eventTimestampUtc: '2020-06-25T00:34:51.496Z',
        deviceType: 'UWP',
        creditsAfter: 131286,
        creditAmount: 10000,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 27886,
      },
      {
        eventTimestampUtc: '2020-06-25T00:34:51.496Z',
        deviceType: 'UWP',
        creditsAfter: 131286,
        creditAmount: 10000,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 27886,
      },
      {
        eventTimestampUtc: '2020-06-25T00:34:51.496Z',
        deviceType: 'UWP',
        creditsAfter: 121286,
        creditAmount: 8301,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 24500,
      },
      {
        eventTimestampUtc: '2020-06-25T00:35:07.814Z',
        deviceType: 'UWP',
        creditsAfter: 141286,
        creditAmount: 10000,
        sceneName: 'EmptySceneWithSpinner',
        totalXp: 33586,
      },
      {
        eventTimestampUtc: '2020-06-25T00:35:07.814Z',
        deviceType: 'UWP',
        creditsAfter: 141286,
        creditAmount: 10000,
        sceneName: 'EmptySceneWithSpinner',
        totalXp: 33586,
      },
      {
        eventTimestampUtc: '2020-06-25T00:35:07.814Z',
        deviceType: 'UWP',
        creditsAfter: 141286,
        creditAmount: 10000,
        sceneName: 'EmptySceneWithSpinner',
        totalXp: 33586,
      },
      {
        eventTimestampUtc: '2020-06-25T00:44:21.987Z',
        deviceType: 'UWP',
        creditsAfter: 147551,
        creditAmount: 6265,
        sceneName: 'BucketListFinishResult',
        totalXp: 35664,
      },
      {
        eventTimestampUtc: '2020-06-25T00:44:21.987Z',
        deviceType: 'UWP',
        creditsAfter: 147551,
        creditAmount: 6265,
        sceneName: 'BucketListFinishResult',
        totalXp: 35664,
      },
      {
        eventTimestampUtc: '2020-06-25T00:44:21.987Z',
        deviceType: 'UWP',
        creditsAfter: 147551,
        creditAmount: 6265,
        sceneName: 'BucketListFinishResult',
        totalXp: 35664,
      },
      {
        eventTimestampUtc: '2020-06-25T01:00:22.402Z',
        deviceType: 'UWP',
        creditsAfter: 155493,
        creditAmount: 7942,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 45568,
      },
      {
        eventTimestampUtc: '2020-06-25T01:00:22.402Z',
        deviceType: 'UWP',
        creditsAfter: 155493,
        creditAmount: 7942,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 45568,
      },
      {
        eventTimestampUtc: '2020-06-25T01:00:22.402Z',
        deviceType: 'UWP',
        creditsAfter: 155493,
        creditAmount: 7942,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 45568,
      },
      {
        eventTimestampUtc: '2020-06-25T01:10:58.799Z',
        deviceType: 'UWP',
        creditsAfter: 162971,
        creditAmount: 7478,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 53603,
      },
      {
        eventTimestampUtc: '2020-06-25T01:10:58.799Z',
        deviceType: 'UWP',
        creditsAfter: 162971,
        creditAmount: 7478,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 53603,
      },
      {
        eventTimestampUtc: '2020-06-25T01:10:58.799Z',
        deviceType: 'UWP',
        creditsAfter: 162971,
        creditAmount: 7478,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 53603,
      },
      {
        eventTimestampUtc: '2020-06-25T01:20:33.834Z',
        deviceType: 'UWP',
        creditsAfter: 168215,
        creditAmount: 5244,
        sceneName: 'EmptySceneWithVignette',
        totalXp: 59536,
      },
      {
        eventTimestampUtc: '2020-06-25T01:20:33.834Z',
        deviceType: 'UWP',
        creditsAfter: 168215,
        creditAmount: 5244,
        sceneName: 'EmptySceneWithVignette',
        totalXp: 59536,
      },
      {
        eventTimestampUtc: '2020-06-25T01:20:33.834Z',
        deviceType: 'UWP',
        creditsAfter: 168215,
        creditAmount: 5244,
        sceneName: 'EmptySceneWithVignette',
        totalXp: 59536,
      },
      {
        eventTimestampUtc: '2020-06-25T01:20:49.086Z',
        deviceType: 'UWP',
        creditsAfter: 168215,
        creditAmount: 0,
        sceneName: 'PostRaceTombola',
        totalXp: 62680,
      },
      {
        eventTimestampUtc: '2020-06-25T01:20:49.086Z',
        deviceType: 'UWP',
        creditsAfter: 168215,
        creditAmount: 0,
        sceneName: 'PostRaceTombola',
        totalXp: 62680,
      },
      {
        eventTimestampUtc: '2020-06-25T01:20:49.086Z',
        deviceType: 'UWP',
        creditsAfter: 168215,
        creditAmount: 0,
        sceneName: 'PostRaceTombola',
        totalXp: 62680,
      },
      {
        eventTimestampUtc: '2020-06-25T01:28:53.096Z',
        deviceType: 'UWP',
        creditsAfter: 178205,
        creditAmount: 9990,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 66072,
      },
      {
        eventTimestampUtc: '2020-06-25T01:28:53.096Z',
        deviceType: 'UWP',
        creditsAfter: 178205,
        creditAmount: 9990,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 66072,
      },
      {
        eventTimestampUtc: '2020-06-25T01:28:53.096Z',
        deviceType: 'UWP',
        creditsAfter: 178205,
        creditAmount: 9990,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 66072,
      },
      {
        eventTimestampUtc: '2020-06-25T01:52:50.411Z',
        deviceType: 'UWP',
        creditsAfter: 184659,
        creditAmount: 6454,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 80808,
      },
      {
        eventTimestampUtc: '2020-06-25T01:52:50.411Z',
        deviceType: 'UWP',
        creditsAfter: 184659,
        creditAmount: 6454,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 80808,
      },
      {
        eventTimestampUtc: '2020-06-25T01:52:50.411Z',
        deviceType: 'UWP',
        creditsAfter: 184659,
        creditAmount: 6454,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 80808,
      },
      {
        eventTimestampUtc: '2020-06-25T01:58:47.511Z',
        deviceType: 'UWP',
        creditsAfter: 191495,
        creditAmount: 6836,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 86429,
      },
      {
        eventTimestampUtc: '2020-06-25T01:58:47.511Z',
        deviceType: 'UWP',
        creditsAfter: 191495,
        creditAmount: 6836,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 86429,
      },
      {
        eventTimestampUtc: '2020-06-25T01:58:47.511Z',
        deviceType: 'UWP',
        creditsAfter: 191495,
        creditAmount: 6836,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 86429,
      },
      {
        eventTimestampUtc: '2020-06-25T01:58:47.512Z',
        deviceType: 'UWP',
        creditsAfter: 201495,
        creditAmount: 10000,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 89989,
      },
      {
        eventTimestampUtc: '2020-06-25T01:58:47.512Z',
        deviceType: 'UWP',
        creditsAfter: 201495,
        creditAmount: 10000,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 89989,
      },
      {
        eventTimestampUtc: '2020-06-25T01:58:47.512Z',
        deviceType: 'UWP',
        creditsAfter: 201495,
        creditAmount: 10000,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 89989,
      },
      {
        eventTimestampUtc: '2020-06-25T02:10:49.444Z',
        deviceType: 'UWP',
        creditsAfter: 216495,
        creditAmount: 15000,
        sceneName: 'Hud',
        totalXp: 93889,
      },
      {
        eventTimestampUtc: '2020-06-25T02:10:49.444Z',
        deviceType: 'UWP',
        creditsAfter: 216495,
        creditAmount: 15000,
        sceneName: 'Hud',
        totalXp: 93889,
      },
      {
        eventTimestampUtc: '2020-06-25T02:10:49.444Z',
        deviceType: 'UWP',
        creditsAfter: 216495,
        creditAmount: 15000,
        sceneName: 'Hud',
        totalXp: 93889,
      },
      {
        eventTimestampUtc: '2020-06-25T02:25:51.538Z',
        deviceType: 'UWP',
        creditsAfter: 226095,
        creditAmount: 9600,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 96125,
      },
      {
        eventTimestampUtc: '2020-06-25T02:25:51.538Z',
        deviceType: 'UWP',
        creditsAfter: 226095,
        creditAmount: 9600,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 96125,
      },
      {
        eventTimestampUtc: '2020-06-25T02:25:51.538Z',
        deviceType: 'UWP',
        creditsAfter: 226095,
        creditAmount: 9600,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 96125,
      },
      {
        eventTimestampUtc: '2020-06-25T02:37:46.305Z',
        deviceType: 'UWP',
        creditsAfter: 233230,
        creditAmount: 7135,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 105743,
      },
      {
        eventTimestampUtc: '2020-06-25T02:37:46.305Z',
        deviceType: 'UWP',
        creditsAfter: 233230,
        creditAmount: 7135,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 105743,
      },
      {
        eventTimestampUtc: '2020-06-25T02:37:46.305Z',
        deviceType: 'UWP',
        creditsAfter: 233230,
        creditAmount: 7135,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 105743,
      },
      {
        eventTimestampUtc: '2020-06-25T02:59:33.939Z',
        deviceType: 'UWP',
        creditsAfter: 242280,
        creditAmount: 9050,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 119473,
      },
      {
        eventTimestampUtc: '2020-06-25T02:59:33.939Z',
        deviceType: 'UWP',
        creditsAfter: 242280,
        creditAmount: 9050,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 119473,
      },
      {
        eventTimestampUtc: '2020-06-25T02:59:33.939Z',
        deviceType: 'UWP',
        creditsAfter: 242280,
        creditAmount: 9050,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 119473,
      },
      {
        eventTimestampUtc: '2020-06-25T02:59:47.678Z',
        deviceType: 'UWP',
        creditsAfter: 287280,
        creditAmount: 45000,
        sceneName: 'PostRaceTombola',
        totalXp: 124529,
      },
      {
        eventTimestampUtc: '2020-06-25T02:59:47.678Z',
        deviceType: 'UWP',
        creditsAfter: 287280,
        creditAmount: 45000,
        sceneName: 'PostRaceTombola',
        totalXp: 124529,
      },
      {
        eventTimestampUtc: '2020-06-25T02:59:47.678Z',
        deviceType: 'UWP',
        creditsAfter: 287280,
        creditAmount: 45000,
        sceneName: 'PostRaceTombola',
        totalXp: 124529,
      },
      {
        eventTimestampUtc: '2020-06-26T00:07:18.965Z',
        deviceType: 'UWP',
        creditsAfter: 296477,
        creditAmount: 9197,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 125215,
      },
      {
        eventTimestampUtc: '2020-06-26T00:13:53.675Z',
        deviceType: 'UWP',
        creditsAfter: 306476,
        creditAmount: 9999,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 131086,
      },
      {
        eventTimestampUtc: '2020-06-26T00:19:15.41Z',
        deviceType: 'UWP',
        creditsAfter: 313566,
        creditAmount: 7090,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 138366,
      },
      {
        eventTimestampUtc: '2020-06-26T00:27:37.621Z',
        deviceType: 'UWP',
        creditsAfter: 323488,
        creditAmount: 9922,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 146559,
      },
      {
        eventTimestampUtc: '2020-06-26T00:27:49.4Z',
        deviceType: 'UWP',
        creditsAfter: 323488,
        creditAmount: 0,
        sceneName: 'PostRaceTombola',
        totalXp: 150962,
      },
      {
        eventTimestampUtc: '2020-06-26T00:38:50.144Z',
        deviceType: 'UWP',
        creditsAfter: 331794,
        creditAmount: 8306,
        sceneName: 'EmptySceneWithVignette',
        totalXp: 154624,
      },
      {
        eventTimestampUtc: '2020-06-26T00:51:55.209Z',
        deviceType: 'UWP',
        creditsAfter: 346222,
        creditAmount: 14428,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 163475,
      },
      {
        eventTimestampUtc: '2020-06-26T01:00:14.7Z',
        deviceType: 'UWP',
        creditsAfter: 354649,
        creditAmount: 8427,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 173399,
      },
      {
        eventTimestampUtc: '2020-06-27T01:23:29.552Z',
        deviceType: 'UWP',
        creditsAfter: 362782,
        creditAmount: 8133,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 179393,
      },
      {
        eventTimestampUtc: '2020-06-27T01:23:38.196Z',
        deviceType: 'UWP',
        creditsAfter: 366782,
        creditAmount: 4000,
        sceneName: 'PostRaceTombola',
        totalXp: 183738,
      },
      {
        eventTimestampUtc: '2020-06-27T01:33:26.156Z',
        deviceType: 'UWP',
        creditsAfter: 376529,
        creditAmount: 9747,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 186060,
      },
      {
        eventTimestampUtc: '2020-06-27T01:42:21.177Z',
        deviceType: 'UWP',
        creditsAfter: 390753,
        creditAmount: 14224,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 192056,
      },
      {
        eventTimestampUtc: '2020-06-27T01:42:28.802Z',
        deviceType: 'UWP',
        creditsAfter: 390753,
        creditAmount: 0,
        sceneName: 'PostRaceTombola',
        totalXp: 198067,
      },
      {
        eventTimestampUtc: '2020-06-27T01:49:09.976Z',
        deviceType: 'UWP',
        creditsAfter: 401071,
        creditAmount: 10318,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 198991,
      },
      {
        eventTimestampUtc: '2020-06-27T01:52:02.109Z',
        deviceType: 'UWP',
        creditsAfter: 411071,
        creditAmount: 10000,
        sceneName: 'Hud',
        totalXp: 207646,
      },
      {
        eventTimestampUtc: '2020-06-27T01:56:39.615Z',
        deviceType: 'UWP',
        creditsAfter: 417500,
        creditAmount: 6429,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 208204,
      },
      {
        eventTimestampUtc: '2020-06-27T02:02:45.01Z',
        deviceType: 'UWP',
        creditsAfter: 425113,
        creditAmount: 7613,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 212915,
      },
      {
        eventTimestampUtc: '2020-06-27T02:09:30.074Z',
        deviceType: 'UWP',
        creditsAfter: 434839,
        creditAmount: 9726,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 218953,
      },
      {
        eventTimestampUtc: '2020-07-03T06:23:40.336Z',
        deviceType: 'UWP',
        creditsAfter: 442678,
        creditAmount: 7839,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 225066,
      },
      {
        eventTimestampUtc: '2020-07-03T06:29:47.227Z',
        deviceType: 'UWP',
        creditsAfter: 453267,
        creditAmount: 10589,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 230270,
      },
      {
        eventTimestampUtc: '2020-07-03T06:33:03.424Z',
        deviceType: 'UWP',
        creditsAfter: 223267,
        creditAmount: -230000,
        sceneName: 'CarColorSelect',
        totalXp: 235567,
      },
      {
        eventTimestampUtc: '2020-07-03T06:36:28.486Z',
        deviceType: 'UWP',
        creditsAfter: 229495,
        creditAmount: 6228,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 236723,
      },
      {
        eventTimestampUtc: '2020-07-03T06:40:38.229Z',
        deviceType: 'UWP',
        creditsAfter: 234015,
        creditAmount: 4520,
        sceneName: 'EmptySceneWithVignette',
        totalXp: 241231,
      },
      {
        eventTimestampUtc: '2020-07-03T06:46:34.195Z',
        deviceType: 'UWP',
        creditsAfter: 241043,
        creditAmount: 7028,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 244608,
      },
      {
        eventTimestampUtc: '2020-07-03T06:57:40.602Z',
        deviceType: 'UWP',
        creditsAfter: 257988,
        creditAmount: 16945,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 250033,
      },
      {
        eventTimestampUtc: '2020-07-03T06:57:54.271Z',
        deviceType: 'UWP',
        creditsAfter: 387988,
        creditAmount: 130000,
        sceneName: 'PostRaceTombola',
        totalXp: 257623,
      },
      {
        eventTimestampUtc: '2020-07-03T07:04:13.149Z',
        deviceType: 'UWP',
        creditsAfter: 398371,
        creditAmount: 10383,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 257899,
      },
      {
        eventTimestampUtc: '2020-07-03T07:17:38.063Z',
        deviceType: 'UWP',
        creditsAfter: 407967,
        creditAmount: 9596,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 263243,
      },
      {
        eventTimestampUtc: '2020-07-03T07:23:43.149Z',
        deviceType: 'UWP',
        creditsAfter: 415884,
        creditAmount: 7917,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 268062,
      },
      {
        eventTimestampUtc: '2020-07-03T07:23:57.436Z',
        deviceType: 'UWP',
        creditsAfter: 415884,
        creditAmount: 0,
        sceneName: 'PostRaceTombola',
        totalXp: 272129,
      },
      {
        eventTimestampUtc: '2020-07-03T07:31:16.125Z',
        deviceType: 'UWP',
        creditsAfter: 425841,
        creditAmount: 9957,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 273129,
      },
      {
        eventTimestampUtc: '2020-07-03T07:42:49.751Z',
        deviceType: 'UWP',
        creditsAfter: 435137,
        creditAmount: 9296,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 279076,
      },
      {
        eventTimestampUtc: '2020-07-03T07:50:00.769Z',
        deviceType: 'UWP',
        creditsAfter: 444644,
        creditAmount: 9507,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 283474,
      },
      {
        eventTimestampUtc: '2020-07-03T07:50:20.288Z',
        deviceType: 'UWP',
        creditsAfter: 444644,
        creditAmount: 0,
        sceneName: 'PostRaceTombola',
        totalXp: 288024,
      },
      {
        eventTimestampUtc: '2020-09-09T23:51:13.171Z',
        deviceType: 'UWP',
        creditsAfter: 459644,
        creditAmount: 15000,
        sceneName: 'Hud',
        totalXp: 290924,
      },
      {
        eventTimestampUtc: '2020-09-10T00:15:07.033Z',
        deviceType: 'UWP',
        creditsAfter: 467357,
        creditAmount: 7713,
        sceneName: 'EmptySceneWithVignette',
        totalXp: 311420,
      },
      {
        eventTimestampUtc: '2020-09-10T00:24:09.267Z',
        deviceType: 'UWP',
        creditsAfter: 477583,
        creditAmount: 10226,
        sceneName: 'EmptySceneWithContinue',
        totalXp: 319046,
      },
      {
        eventTimestampUtc: '2020-09-10T00:40:22.398Z',
        deviceType: 'UWP',
        creditsAfter: 511830,
        creditAmount: 34247,
        sceneName: 'EmptySceneWithVignette',
        totalXp: 325702,
      },
    ];
  }
}
