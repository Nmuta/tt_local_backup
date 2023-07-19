using System;
using System.Net;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Exceptions
{
    /// <summary>
    ///     Represents a 'friendly' LSP failure exception.
    /// </summary>
    public sealed class LspFailureStewardException : StewardBaseException
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="LspFailureStewardException"/> class.
        /// </summary>
        public LspFailureStewardException()
            : base()
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="LspFailureStewardException"/> class.
        /// </summary>
        public LspFailureStewardException(string message)
            : base(message)
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="LspFailureStewardException"/> class.
        /// </summary>
        public LspFailureStewardException(string message, Exception innerException)
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
        public override StewardErrorCode ErrorCode => StewardErrorCode.ServicesFailure;
    }
}
