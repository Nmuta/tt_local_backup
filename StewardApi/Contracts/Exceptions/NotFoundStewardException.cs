using System;
using System.Net;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Exceptions
{
    /// <summary>
    ///     Represents a 'friendly' not found exception.
    /// </summary>
    public sealed class NotFoundStewardException : StewardBaseException
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="NotFoundStewardException"/> class.
        /// </summary>
        public NotFoundStewardException()
            : base()
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="NotFoundStewardException"/> class.
        /// </summary>
        public NotFoundStewardException(string message)
            : base(message)
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="NotFoundStewardException"/> class.
        /// </summary>
        public NotFoundStewardException(string message, Exception innerException)
            : base(message, innerException)
        {
        }

        /// <summary>
        ///     Gets the status code.
        /// </summary>
        public override HttpStatusCode StatusCode => HttpStatusCode.NotFound;

        /// <summary>
        ///     Gets the error code.
        /// </summary>
        public override StewardErrorCode ErrorCode => StewardErrorCode.DocumentNotFound;
    }
}
