using System;
using System.Net;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Exceptions
{
    /// <summary>
    ///     Represents a 'friendly' bad gateway exception.
    /// </summary>
    public sealed class BadGatewayStewardException : StewardBaseException
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="BadGatewayStewardException"/> class.
        /// </summary>
        public BadGatewayStewardException()
            : base()
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="BadGatewayStewardException"/> class.
        /// </summary>
        public BadGatewayStewardException(string message)
            : base(message)
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="BadGatewayStewardException"/> class.
        /// </summary>
        public BadGatewayStewardException(string message, Exception innerException)
            : base(message, innerException)
        {
        }

        /// <summary>
        ///     Gets the status code.
        /// </summary>
        public override HttpStatusCode StatusCode => HttpStatusCode.BadGateway;

        /// <summary>
        ///     Gets the error code.
        /// </summary>
        public override StewardErrorCode ErrorCode => StewardErrorCode.UnknownFailure;
    }
}