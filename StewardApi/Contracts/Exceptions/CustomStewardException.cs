using System;
using System.Net;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Exceptions
{
    /// <summary>
    ///     Represents an 'friendly' unknown failure exception.
    /// </summary>
#pragma warning disable CA1032 // Implement standard exception constructors
    public sealed class CustomStewardException : StewardBaseException
#pragma warning restore CA1032 // Implement standard exception constructors
    {
        private readonly HttpStatusCode statusCode;

        /// <summary>
        ///     Initializes a new instance of the <see cref="CustomStewardException"/> class.
        /// </summary>
        public CustomStewardException(HttpStatusCode statusCode, string message)
            : this(statusCode, message, null)
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="CustomStewardException"/> class.
        /// </summary>
        public CustomStewardException(HttpStatusCode statusCode, string message, Exception innerException)
            : base(message, innerException)
        {
            this.statusCode = statusCode;
        }

        /// <summary>
        ///     Gets the status code.
        /// </summary>
        public override HttpStatusCode StatusCode => this.statusCode;

        /// <summary>
        ///     Gets the error code.
        /// </summary>
        public override StewardErrorCode ErrorCode => StewardErrorCode.RelayedFromUtil;
    }
}