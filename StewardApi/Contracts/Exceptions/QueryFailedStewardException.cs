using System;
using System.Net;

namespace Turn10.LiveOps.StewardApi.Contracts.Exceptions
{
    /// <summary>
    ///     Represents a 'friendly' failed query exception.
    /// </summary>
    public sealed class QueryFailedStewardException : StewardBaseException
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="QueryFailedStewardException"/> class.
        /// </summary>
        public QueryFailedStewardException()
            : base()
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="QueryFailedStewardException"/> class.
        /// </summary>
        public QueryFailedStewardException(string message)
            : base(message)
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="QueryFailedStewardException"/> class.
        /// </summary>
        public QueryFailedStewardException(string message, Exception innerException)
            : base(message, innerException)
        {
        }

        /// <summary>
        ///     Gets the status code.
        /// </summary>
        public override HttpStatusCode StatusCode => HttpStatusCode.InternalServerError;

        /// <summary>
        ///     Gets the error code.
        /// </summary>
        public override StewardErrorCode ErrorCode => StewardErrorCode.QueryFailed;
    }
}