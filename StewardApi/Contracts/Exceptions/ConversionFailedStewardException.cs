using System;
using System.Net;

namespace Turn10.LiveOps.StewardApi.Contracts.Exceptions
{
    /// <summary>
    ///     Represents a 'friendly 'conversion failed exception.
    /// </summary>
    public sealed class ConversionFailedStewardException : StewardBaseException
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="ConversionFailedStewardException"/> class.
        /// </summary>
        public ConversionFailedStewardException()
            : base()
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="ConversionFailedStewardException"/> class.
        /// </summary>
        public ConversionFailedStewardException(string message)
            : base(message)
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="ConversionFailedStewardException"/> class.
        /// </summary>
        public ConversionFailedStewardException(string message, Exception innerException)
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
        public override StewardErrorCode ErrorCode => StewardErrorCode.ConversionFailed;
    }
}