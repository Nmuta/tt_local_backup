using System;
using System.Net;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Exceptions
{
    /// <summary>
    ///     Represents an 'friendly' unknown failure exception.
    /// </summary>
    public sealed class ForbiddenStewardException : StewardBaseException
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="ForbiddenStewardException"/> class.
        /// </summary>
        public ForbiddenStewardException()
            : base()
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="ForbiddenStewardException"/> class.
        /// </summary>
        public ForbiddenStewardException(string message)
            : base(message)
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="ForbiddenStewardException"/> class.
        /// </summary>
        public ForbiddenStewardException(string message, Exception innerException)
            : base(message, innerException)
        {
        }

        /// <summary>
        ///     Gets the status code.
        /// </summary>
        public override HttpStatusCode StatusCode => HttpStatusCode.Forbidden;

        /// <summary>
        ///     Gets the error code.
        /// </summary>
        public override StewardErrorCode ErrorCode => StewardErrorCode.Forbidden;
    }
}