using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Exceptions
{
    /// <summary>
    ///     Represents a 'friendly ' bad header exception.
    /// </summary>
    public sealed class BadHeaderStewardException : StewardBaseException
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="BadHeaderStewardException"/> class.
        /// </summary>
        public BadHeaderStewardException()
            : base()
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="BadHeaderStewardException"/> class.
        /// </summary>
        public BadHeaderStewardException(string message)
            : base(message)
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="BadHeaderStewardException"/> class.
        /// </summary>
        public BadHeaderStewardException(string message, Exception innerException)
            : base(message, innerException)
        {
        }

        /// <summary>
        ///     Gets the status code.
        /// </summary>
        public override HttpStatusCode StatusCode => HttpStatusCode.BadRequest;

        /// <summary>
        ///     Gets the error code.
        /// </summary>
        public override StewardErrorCode ErrorCode => StewardErrorCode.RequiredParameterMissing;
    }
}
