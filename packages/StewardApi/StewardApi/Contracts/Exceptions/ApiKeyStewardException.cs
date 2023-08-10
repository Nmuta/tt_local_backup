using System;
using System.Net;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Exceptions
{
    /// <summary>
    ///     Represents a 'friendly' invalid argument exception.
    /// </summary>
    public sealed class ApiKeyStewardException : StewardBaseException
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="ApiKeyStewardException"/> class.
        /// </summary>
        public ApiKeyStewardException()
            : base()
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="ApiKeyStewardException"/> class.
        /// </summary>
        public ApiKeyStewardException(string message)
            : base(message)
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="ApiKeyStewardException"/> class.
        /// </summary>
        public ApiKeyStewardException(string message, Exception innerException)
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
