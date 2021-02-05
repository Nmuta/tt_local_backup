import { MSError } from './error.model';
import { GamertagString, T10IdString } from './extended-types';

/** An identity query by gamertag. */
interface IdentityQueryByGamertag {
  gamertag: GamertagString;
}

/** An identity query by xuid. */
interface IdentityQueryByXuid {
  xuid: bigint;
}

/** An identity query by t10Id. */
interface IdentityQueryByT10Id {
  t10Id: T10IdString;
}

/** Creates a valid @see IdentityQueryAlpha from a variety of inputs. */
export function makeAlphaQuery(type: 'gamertag' | 'xuid', value: string | bigint): IdentityQueryAlpha {
  switch (type) {
    case 'gamertag':
      return { gamertag: value.toString() };
    case 'xuid':
      return { xuid: BigInt(value) };
    default:
      throw new Error(`Unacceptable type ${type} (value: ${value})`);
  }
}

/** Creates a valid @see IdentityQueryBeta from a variety of inputs. */
export function makeBetaQuery(type: 'gamertag' | 'xuid' | 't10Id', value: string | bigint): IdentityQueryBeta {
  switch (type) {
    case 'gamertag':
      return { gamertag: value.toString() };
    case 'xuid':
      return { xuid: BigInt(value) };
    case 't10Id':
      return { t10Id: value.toString() };
    default:
      throw new Error(`Unacceptable type ${type} (value: ${value})`);
  }
}

/** Type-checking for @see IdentityQueryAlpha */
export function isValidAlphaQuery(mystery: unknown): mystery is IdentityQueryAlpha {
  return isGamertagQuery(mystery) || isXuidQuery(mystery);
}

/** Type-checking for @see IdentityQueryBeta */
export function isValidBetaQuery(mystery: unknown): mystery is IdentityQueryBeta {
  return isGamertagQuery(mystery) || isXuidQuery(mystery) || isT10IdQuery(mystery);
}

/** Type-checking for @see IdentityQueryByGamertag */
export function isGamertagQuery(mystery: unknown): mystery is IdentityQueryByGamertag {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return 'gamertag' in (mystery as any);
}

/** Type-checking for @see IdentityQueryByXuid */
export function isXuidQuery(mystery: unknown): mystery is IdentityQueryByXuid {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return 'xuid' in (mystery as any);
}

/** Type-checking for @see IdentityQueryByT10Id */
export function isT10IdQuery(mystery: unknown): mystery is IdentityQueryByT10Id {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return 't10Id' in (mystery as any);
}

/** Contextual information about T10IDs. */
export interface T10IdInfo {
  t10Id: T10IdString;
  createdUtc: Date;
  lastAccessedUtc: Date;
}

/**
 * A single identity query. Alpha type.
 *
 * Designed to work on games which use XUID as a primary identifier such as:
 * - FH4
 * - FM7
 * - FH3
 */
export type IdentityQueryAlpha = IdentityQueryByGamertag | IdentityQueryByXuid;

/**
 * A single identity query result. Alpha type.
 *
 * Designed to work on games which use XUID as a primary identifier such as:
 * - FH4
 * - FM7
 * - FH3
 */
export interface IdentityResultAlpha {
  /** The initial query. */
  query: IdentityQueryAlpha;
  /** The gamertag, if found. */
  gamertag?: string;
  /** The XUID, if found. */
  xuid?: bigint;
  /** Why this query failed. */
  error?: MSError;
}

/**
 * A single identity query. Beta type.
 *
 * Designed to work on games which use T10ID as a primary identifier such as:
 * - Street
 * - Future Titles?
 */
export type IdentityQueryBeta =
  | IdentityQueryByGamertag
  | IdentityQueryByXuid
  | IdentityQueryByT10Id;

/**
 * A single identity query result. Beta type.
 *
 * Designed to work on games which use T10ID as a primary identifier such as:
 * - Street
 * - Future Titles?
 */
export interface IdentityResultBeta {
  /** The initial query. */
  query: IdentityQueryBeta;
  /** The gamertag, if found. */
  gamertag?: string;
  /** The XUID, if found. */
  xuid?: bigint;
  /** The principal T10ID, if found. */
  t10Id?: string;
  /** The other T10IDs, if found. */
  t10Ids?: T10IdInfo[];
  /** Why this query failed. */
  error?: MSError;
}

/**
 * A batch of identity queries. Alpha type.
 *
 * Designed to work on games which use XUID as a primary identifier such as:
 * - FH4
 * - FM7
 * - FH3
 * @see IdentityQueryAlpha
 */
export type IdentityQueryAlphaBatch = IdentityQueryAlpha[];

/**
 * A batch of identity query. Beta type.
 *
 * Designed to work on games which use T10ID as a primary identifier such as:
 * - Street
 * - Future Titles?
 * @see IdentityQueryBeta
 */
export type IdentityQueryBetaBatch = IdentityQueryBeta[];

/**
 * A batch of identity query results. Alpha type.
 *
 * Designed to work on games which use XUID as a primary identifier such as:
 * - FH4
 * - FM7
 * - FH3
 * @see IdentityResultAlpha
 */
export type IdentityResultAlphaBatch = IdentityResultAlpha[];

/**
 * A batch of identity query results. Beta type.
 *
 * Designed to work on games which use T10ID as a primary identifier such as:
 * - Street
 * - Future Titles?
 * @see IdentityResultBeta
 */
export type IdentityResultBetaBatch = IdentityResultBeta[];

/** Union of IdentityResultAlpha and IdentityResultBeta */
export type IdentityResultUnion = IdentityResultAlpha | IdentityResultBeta;

/** Intersection of IdentityResultAlpha and IdentityResultBeta */
export type IdentityResultIntersection = IdentityResultAlpha & IdentityResultBeta;

/** Intersection version of @see IdentityQueryAlpha */
export type IdentityQueryAlphaIntersection = IdentityQueryByXuid & IdentityQueryByGamertag;

/** Intersection version of @see IdentityQueryBeta */
export type IdentityQueryBetaIntersection = IdentityQueryByXuid & IdentityQueryByGamertag & IdentityQueryByT10Id;