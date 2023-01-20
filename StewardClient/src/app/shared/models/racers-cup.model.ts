import BigNumber from 'bignumber.js';
import { DateTime, Duration } from 'luxon';

/** Interface for a Racer's Cup Schedule. */
export interface RacersCupSchedule {
  championships: RacersCupChampionship[];
}

/** Interface for a Racer's Cup Championship. */
export interface RacersCupChampionship {
  series: RacersCupSeries[];
}

/** Interface for a Racer's Cup Series. */
export interface RacersCupSeries {
  name: string;
  events: RacersCupEvent[];
  openTimeUtc: DateTime;
  closeTimeUtc: DateTime;
  eventPlaylistTransitionTimeUtc: Duration;
}

/** Interface for a Racer's Cup Event. */
export interface RacersCupEvent {
  name: string;
  playlistName: string;
  openPracticeInMinutes: BigNumber;
  eventWindows: RacersCupEventWindow[];
  gameOptions: RacersCupGameOptions[];
  qualificationOptions: RacersCupQualificationOptions;
}

/** Interface for a Racer's Cup Event Window. */
export interface RacersCupEventWindow {
  startTimeUtc: DateTime;
  endTimeUtc: DateTime;
  featuredRaceStarTimeUtc: DateTime;
}

/** Interface for Racer's Cup Qualification Options. */
export interface RacersCupQualificationOptions {
  numberOfLimitedLaps: BigNumber;
  isOneShot: boolean;
  qualificationLimitType: RacersCupQualificationLimitType;
}

/** Interface for Racer's Cup Game Options. */
export interface RacersCupGameOptions {
  timeOfDay: Date; // Purposefully using Date because this represents an in-game time and not a realworld time.
  timeOfDayTimeScale: BigNumber;
  midRaceWeatherConditionProbability: BigNumber;
  endRaceWeatherConditionProbability: BigNumber;
  startRaceWeatherCondition: RacersCupWeatherCondition;
  midRaceWeatherCondition: RacersCupWeatherCondition;
  endRaceWeatherCondition: RacersCupWeatherCondition;
  eventSessionType: RacersCupEventSessionType;
}

/** Interface for Racer's Cup Weather Condition. */
export interface RacersCupWeatherCondition {
  id: string;
  name: string;
  weatherConditionType: RacersCupWeatherCondtionType;
}

/** Enum for Racer's Cup Qualification Limit types. */
export enum RacersCupQualificationLimitType {
  Unlimited = 'Unlimited',
  LimitedLaps = 'LimitedLaps',
  Disabled = 'Disabled',
}

/** Enum for Racer's Cup Weather Condition types. */
export enum RacersCupWeatherCondtionType {
  Clear = 'Clear',
  Cloudy = 'Cloudy',
  Overcast = 'Overcast',
  Thunderstorm = 'Thunderstorm',
}

/** Enum for Racer's Cup Event Session types. */
export enum RacersCupEventSessionType {
  FeaturedRace = 'FeaturedRace',
  PracticeAndQualification = 'PracticeAndQualification',
}

/** Enum for Racer's Cup Car Class IDs. */
export enum RacersCupCarClassId {
  E = 'E',
  D = 'D',
  C = 'C',
  B = 'B',
  A = 'A',
  S = 'S',
  R = 'R',
  p = 'P',
  X = 'X',
  Any = 'Any',
  Unknown = 'Unknown',
}
