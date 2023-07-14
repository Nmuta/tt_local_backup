/**
 * Top level model for an error response.
 * @see https://github.com/microsoft/api-guidelines/blob/vNext/Guidelines.md#errorresponse--object
 */
export interface MSErrorResponse {
  /** The error object. */
  error: MSError;
}

/**
 * An error response object.
 *
 * May contain other fields.
 * @see https://github.com/microsoft/api-guidelines/blob/vNext/Guidelines.md#errorresponse--object
 */
export interface MSError {
  /** One of a server-defined set of error codes. */
  code: string;
  /** A human-readable representation of the error. */
  message: string;
  /** The target of the error. */
  target: string;
  /** An array of details about specific errors that led to this reported error. */
  details: MSError[];
  /** An object containing more specific information than the current object about the error. */
  innererror: MSInnerError;
}

/**
 * An inner error response object.
 *
 * May contain other fields.
 * @see https://github.com/microsoft/api-guidelines/blob/vNext/Guidelines.md#errorresponse--object
 */
export interface MSInnerError {
  /** A more specific error code than was provided by the containing error. */
  code: string;
  /** An object containing more specific information than the current object about the error. */
  innererror: MSInnerError;
}
