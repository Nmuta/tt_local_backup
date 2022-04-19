using System;
using System.Net;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Exceptions
{
    /// <summary>
    ///     Represents a 'friendly' Pegasus exception.
    /// </summary>
    public sealed class PegasusStewardException : StewardBaseException
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="PegasusStewardException"/> class.
        /// </summary>
        public PegasusStewardException()
            : base()
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="PegasusStewardException"/> class.
        /// </summary>
        public PegasusStewardException(string message)
            : base(message)
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="PegasusStewardException"/> class.
        /// </summary>
        public PegasusStewardException(string message, Exception innerException)
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
