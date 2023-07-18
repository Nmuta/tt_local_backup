using System;
using System.Net;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Exceptions
{
    /// <summary>
    ///     Represents a 'friendly' failed to send exception.
    /// </summary>
    public sealed class FailedToSendStewardException : StewardBaseException
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="FailedToSendStewardException"/> class.
        /// </summary>
        public FailedToSendStewardException()
            : base()
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="FailedToSendStewardException"/> class.
        /// </summary>
        public FailedToSendStewardException(string message)
            : base(message)
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="FailedToSendStewardException"/> class.
        /// </summary>
        public FailedToSendStewardException(string message, Exception innerException)
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
        public override StewardErrorCode ErrorCode => StewardErrorCode.FailedToSend;
    }
}
