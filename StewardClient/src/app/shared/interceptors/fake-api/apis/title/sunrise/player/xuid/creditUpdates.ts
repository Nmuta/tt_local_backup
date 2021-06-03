import BigNumber from 'bignumber.js';
import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { SunriseCreditDetailsEntry } from '@models/sunrise';
import { toDateTime } from '@helpers/luxon';

/** Fake API for finding User Flags. */
export class SunrisePlayerXuidCreditUpdatesFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/sunrise\/player\/xuid\((\d+)\)\/creditUpdates$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): SunriseCreditDetailsEntry[] {
    return SunrisePlayerXuidCreditUpdatesFakeApi.makeMany();
  }

  /** Creates a sample response. */
  public static makeMany(): SunriseCreditDetailsEntry[] {
    return [
      {
        eventTimestampUtc: toDateTime('2020-06-19T00:33:10.117Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(26708),
        creditAmount: new BigNumber(6708),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(600),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-19T00:43:57.752Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(31918),
        creditAmount: new BigNumber(5210),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(3374),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-19T00:43:57.752Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(41918),
        creditAmount: new BigNumber(10000),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(5528),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-19T00:50:46.878Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(46717),
        creditAmount: new BigNumber(4799),
        sceneName: 'BucketListFinishResult',
        totalXp: new BigNumber(5528),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-19T00:50:46.879Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(56717),
        creditAmount: new BigNumber(10000),
        sceneName: 'BucketListFinishResult',
        totalXp: new BigNumber(13028),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-19T00:54:49.09Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(66717),
        creditAmount: new BigNumber(10000),
        sceneName: 'Hud',
        totalXp: new BigNumber(13628),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-19T00:59:11.69Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(74669),
        creditAmount: new BigNumber(7952),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(13628),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-19T00:59:32.294Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(89669),
        creditAmount: new BigNumber(15000),
        sceneName: 'PostRaceTombola',
        totalXp: new BigNumber(17155),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-19T01:19:46.23Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(97767),
        creditAmount: new BigNumber(8098),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(17155),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-19T01:19:46.231Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(107767),
        creditAmount: new BigNumber(10000),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(20532),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T00:17:39.476Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(112985),
        creditAmount: new BigNumber(5218),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(20532),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T00:17:39.476Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(112985),
        creditAmount: new BigNumber(5218),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(20532),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T00:17:39.476Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(112985),
        creditAmount: new BigNumber(5218),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(20532),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T00:34:51.496Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(131286),
        creditAmount: new BigNumber(10000),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(27886),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T00:34:51.496Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(121286),
        creditAmount: new BigNumber(8301),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(24500),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T00:34:51.496Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(121286),
        creditAmount: new BigNumber(8301),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(24500),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T00:34:51.496Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(131286),
        creditAmount: new BigNumber(10000),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(27886),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T00:34:51.496Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(131286),
        creditAmount: new BigNumber(10000),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(27886),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T00:34:51.496Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(121286),
        creditAmount: new BigNumber(8301),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(24500),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T00:35:07.814Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(141286),
        creditAmount: new BigNumber(10000),
        sceneName: 'EmptySceneWithSpinner',
        totalXp: new BigNumber(33586),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T00:35:07.814Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(141286),
        creditAmount: new BigNumber(10000),
        sceneName: 'EmptySceneWithSpinner',
        totalXp: new BigNumber(33586),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T00:35:07.814Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(141286),
        creditAmount: new BigNumber(10000),
        sceneName: 'EmptySceneWithSpinner',
        totalXp: new BigNumber(33586),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T00:44:21.987Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(147551),
        creditAmount: new BigNumber(6265),
        sceneName: 'BucketListFinishResult',
        totalXp: new BigNumber(35664),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T00:44:21.987Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(147551),
        creditAmount: new BigNumber(6265),
        sceneName: 'BucketListFinishResult',
        totalXp: new BigNumber(35664),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T00:44:21.987Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(147551),
        creditAmount: new BigNumber(6265),
        sceneName: 'BucketListFinishResult',
        totalXp: new BigNumber(35664),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T01:00:22.402Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(155493),
        creditAmount: new BigNumber(7942),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(45568),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T01:00:22.402Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(155493),
        creditAmount: new BigNumber(7942),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(45568),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T01:00:22.402Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(155493),
        creditAmount: new BigNumber(7942),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(45568),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T01:10:58.799Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(162971),
        creditAmount: new BigNumber(7478),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(53603),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T01:10:58.799Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(162971),
        creditAmount: new BigNumber(7478),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(53603),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T01:10:58.799Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(162971),
        creditAmount: new BigNumber(7478),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(53603),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T01:20:33.834Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(168215),
        creditAmount: new BigNumber(5244),
        sceneName: 'EmptySceneWithVignette',
        totalXp: new BigNumber(59536),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T01:20:33.834Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(168215),
        creditAmount: new BigNumber(5244),
        sceneName: 'EmptySceneWithVignette',
        totalXp: new BigNumber(59536),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T01:20:33.834Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(168215),
        creditAmount: new BigNumber(5244),
        sceneName: 'EmptySceneWithVignette',
        totalXp: new BigNumber(59536),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T01:20:49.086Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(168215),
        creditAmount: new BigNumber(0),
        sceneName: 'PostRaceTombola',
        totalXp: new BigNumber(62680),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T01:20:49.086Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(168215),
        creditAmount: new BigNumber(0),
        sceneName: 'PostRaceTombola',
        totalXp: new BigNumber(62680),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T01:20:49.086Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(168215),
        creditAmount: new BigNumber(0),
        sceneName: 'PostRaceTombola',
        totalXp: new BigNumber(62680),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T01:28:53.096Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(178205),
        creditAmount: new BigNumber(9990),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(66072),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T01:28:53.096Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(178205),
        creditAmount: new BigNumber(9990),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(66072),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T01:28:53.096Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(178205),
        creditAmount: new BigNumber(9990),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(66072),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T01:52:50.411Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(184659),
        creditAmount: new BigNumber(6454),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(80808),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T01:52:50.411Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(184659),
        creditAmount: new BigNumber(6454),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(80808),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T01:52:50.411Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(184659),
        creditAmount: new BigNumber(6454),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(80808),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T01:58:47.511Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(191495),
        creditAmount: new BigNumber(6836),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(86429),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T01:58:47.511Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(191495),
        creditAmount: new BigNumber(6836),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(86429),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T01:58:47.511Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(191495),
        creditAmount: new BigNumber(6836),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(86429),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T01:58:47.512Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(201495),
        creditAmount: new BigNumber(10000),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(89989),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T01:58:47.512Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(201495),
        creditAmount: new BigNumber(10000),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(89989),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T01:58:47.512Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(201495),
        creditAmount: new BigNumber(10000),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(89989),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T02:10:49.444Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(216495),
        creditAmount: new BigNumber(15000),
        sceneName: 'Hud',
        totalXp: new BigNumber(93889),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T02:10:49.444Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(216495),
        creditAmount: new BigNumber(15000),
        sceneName: 'Hud',
        totalXp: new BigNumber(93889),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T02:10:49.444Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(216495),
        creditAmount: new BigNumber(15000),
        sceneName: 'Hud',
        totalXp: new BigNumber(93889),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T02:25:51.538Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(226095),
        creditAmount: new BigNumber(9600),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(96125),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T02:25:51.538Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(226095),
        creditAmount: new BigNumber(9600),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(96125),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T02:25:51.538Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(226095),
        creditAmount: new BigNumber(9600),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(96125),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T02:37:46.305Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(233230),
        creditAmount: new BigNumber(7135),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(105743),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T02:37:46.305Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(233230),
        creditAmount: new BigNumber(7135),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(105743),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T02:37:46.305Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(233230),
        creditAmount: new BigNumber(7135),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(105743),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T02:59:33.939Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(242280),
        creditAmount: new BigNumber(9050),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(119473),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T02:59:33.939Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(242280),
        creditAmount: new BigNumber(9050),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(119473),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T02:59:33.939Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(242280),
        creditAmount: new BigNumber(9050),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(119473),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T02:59:47.678Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(287280),
        creditAmount: new BigNumber(45000),
        sceneName: 'PostRaceTombola',
        totalXp: new BigNumber(124529),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T02:59:47.678Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(287280),
        creditAmount: new BigNumber(45000),
        sceneName: 'PostRaceTombola',
        totalXp: new BigNumber(124529),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-25T02:59:47.678Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(287280),
        creditAmount: new BigNumber(45000),
        sceneName: 'PostRaceTombola',
        totalXp: new BigNumber(124529),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-26T00:07:18.965Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(296477),
        creditAmount: new BigNumber(9197),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(125215),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-26T00:13:53.675Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(306476),
        creditAmount: new BigNumber(9999),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(131086),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-26T00:19:15.41Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(313566),
        creditAmount: new BigNumber(7090),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(138366),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-26T00:27:37.621Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(323488),
        creditAmount: new BigNumber(9922),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(146559),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-26T00:27:49.4Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(323488),
        creditAmount: new BigNumber(0),
        sceneName: 'PostRaceTombola',
        totalXp: new BigNumber(150962),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-26T00:38:50.144Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(331794),
        creditAmount: new BigNumber(8306),
        sceneName: 'EmptySceneWithVignette',
        totalXp: new BigNumber(154624),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-26T00:51:55.209Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(346222),
        creditAmount: new BigNumber(14428),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(163475),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-26T01:00:14.7Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(354649),
        creditAmount: new BigNumber(8427),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(173399),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-27T01:23:29.552Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(362782),
        creditAmount: new BigNumber(8133),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(179393),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-27T01:23:38.196Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(366782),
        creditAmount: new BigNumber(4000),
        sceneName: 'PostRaceTombola',
        totalXp: new BigNumber(183738),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-27T01:33:26.156Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(376529),
        creditAmount: new BigNumber(9747),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(186060),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-27T01:42:21.177Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(390753),
        creditAmount: new BigNumber(14224),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(192056),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-27T01:42:28.802Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(390753),
        creditAmount: new BigNumber(0),
        sceneName: 'PostRaceTombola',
        totalXp: new BigNumber(198067),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-27T01:49:09.976Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(401071),
        creditAmount: new BigNumber(10318),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(198991),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-27T01:52:02.109Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(411071),
        creditAmount: new BigNumber(10000),
        sceneName: 'Hud',
        totalXp: new BigNumber(207646),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-27T01:56:39.615Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(417500),
        creditAmount: new BigNumber(6429),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(208204),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-27T02:02:45.01Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(425113),
        creditAmount: new BigNumber(7613),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(212915),
      },
      {
        eventTimestampUtc: toDateTime('2020-06-27T02:09:30.074Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(434839),
        creditAmount: new BigNumber(9726),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(218953),
      },
      {
        eventTimestampUtc: toDateTime('2020-07-03T06:23:40.336Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(442678),
        creditAmount: new BigNumber(7839),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(225066),
      },
      {
        eventTimestampUtc: toDateTime('2020-07-03T06:29:47.227Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(453267),
        creditAmount: new BigNumber(10589),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(230270),
      },
      {
        eventTimestampUtc: toDateTime('2020-07-03T06:33:03.424Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(223267),
        creditAmount: new BigNumber(-230000),
        sceneName: 'CarColorSelect',
        totalXp: new BigNumber(235567),
      },
      {
        eventTimestampUtc: toDateTime('2020-07-03T06:36:28.486Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(229495),
        creditAmount: new BigNumber(6228),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(236723),
      },
      {
        eventTimestampUtc: toDateTime('2020-07-03T06:40:38.229Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(234015),
        creditAmount: new BigNumber(4520),
        sceneName: 'EmptySceneWithVignette',
        totalXp: new BigNumber(241231),
      },
      {
        eventTimestampUtc: toDateTime('2020-07-03T06:46:34.195Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(241043),
        creditAmount: new BigNumber(7028),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(244608),
      },
      {
        eventTimestampUtc: toDateTime('2020-07-03T06:57:40.602Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(257988),
        creditAmount: new BigNumber(16945),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(250033),
      },
      {
        eventTimestampUtc: toDateTime('2020-07-03T06:57:54.271Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(387988),
        creditAmount: new BigNumber(130000),
        sceneName: 'PostRaceTombola',
        totalXp: new BigNumber(257623),
      },
      {
        eventTimestampUtc: toDateTime('2020-07-03T07:04:13.149Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(398371),
        creditAmount: new BigNumber(10383),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(257899),
      },
      {
        eventTimestampUtc: toDateTime('2020-07-03T07:17:38.063Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(407967),
        creditAmount: new BigNumber(9596),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(263243),
      },
      {
        eventTimestampUtc: toDateTime('2020-07-03T07:23:43.149Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(415884),
        creditAmount: new BigNumber(7917),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(268062),
      },
      {
        eventTimestampUtc: toDateTime('2020-07-03T07:23:57.436Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(415884),
        creditAmount: new BigNumber(0),
        sceneName: 'PostRaceTombola',
        totalXp: new BigNumber(272129),
      },
      {
        eventTimestampUtc: toDateTime('2020-07-03T07:31:16.125Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(425841),
        creditAmount: new BigNumber(9957),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(273129),
      },
      {
        eventTimestampUtc: toDateTime('2020-07-03T07:42:49.751Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(435137),
        creditAmount: new BigNumber(9296),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(279076),
      },
      {
        eventTimestampUtc: toDateTime('2020-07-03T07:50:00.769Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(444644),
        creditAmount: new BigNumber(9507),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(283474),
      },
      {
        eventTimestampUtc: toDateTime('2020-07-03T07:50:20.288Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(444644),
        creditAmount: new BigNumber(0),
        sceneName: 'PostRaceTombola',
        totalXp: new BigNumber(288024),
      },
      {
        eventTimestampUtc: toDateTime('2020-09-09T23:51:13.171Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(459644),
        creditAmount: new BigNumber(15000),
        sceneName: 'Hud',
        totalXp: new BigNumber(290924),
      },
      {
        eventTimestampUtc: toDateTime('2020-09-10T00:15:07.033Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(467357),
        creditAmount: new BigNumber(7713),
        sceneName: 'EmptySceneWithVignette',
        totalXp: new BigNumber(311420),
      },
      {
        eventTimestampUtc: toDateTime('2020-09-10T00:24:09.267Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(477583),
        creditAmount: new BigNumber(10226),
        sceneName: 'EmptySceneWithContinue',
        totalXp: new BigNumber(319046),
      },
      {
        eventTimestampUtc: toDateTime('2020-09-10T00:40:22.398Z'),
        deviceType: 'UWP',
        creditsAfter: new BigNumber(511830),
        creditAmount: new BigNumber(34247),
        sceneName: 'EmptySceneWithVignette',
        totalXp: new BigNumber(325702),
      },
    ];
  }
}
