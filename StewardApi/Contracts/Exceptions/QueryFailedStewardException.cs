using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Exceptions
{
    /// <summary>
    ///     Represents a failed query Steward exception.
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
    }
}