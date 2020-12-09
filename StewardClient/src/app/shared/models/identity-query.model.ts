import { MSError } from './error.model';

/** An identity query by gamertag. */
interface IdentityQueryByGamertag {
  gamertag: string;
}

/** An identity query by xuid. */
interface IdentityQueryByXuid {
  xuid: BigInt;
}

/** An identity query by t10id. */
interface IdentityQueryByT10Id {
  t10id: string;
}

/** Contextual information about T10IDs. */
export interface T10IdInfo {
  t10id: string;
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
  query: IdentityQueryAlpha,
  /** The gamertag, if found. */
  gamertag?: string;
  /** The XUID, if found. */
  xuid?: BigInt;
  /** Why this query failed. */
  error: MSError;
}

/**
 * A single identity query. Beta type.
 * 
 * Designed to work on games which use T10ID as a primary identifier such as:
 * - Street
 * - Future Titles?
 */
export type IdentityQueryBeta = IdentityQueryByGamertag | IdentityQueryByXuid | IdentityQueryByT10Id;

/**
 * A single identity query result. Beta type.
 * 
 * Designed to work on games which use T10ID as a primary identifier such as:
 * - Street
 * - Future Titles?
 */
export interface IdentityResultBeta {
  /** The initial query. */
  query: IdentityQueryBeta,
  /** The gamertag, if found. */
  gamertag?: string;
  /** The XUID, if found. */
  xuid?: BigInt;
  /** The principal T10ID, if found. */
  t10id?: string;
  /** The other T10IDs, if found. */
  t10ids?: T10IdInfo[];
  /** Why this query failed. */
  error: MSError;
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
export type IdentityQueryBetaBatch = IdentityQueryBeta[]

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