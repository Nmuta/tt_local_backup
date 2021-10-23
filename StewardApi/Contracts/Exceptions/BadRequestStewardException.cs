using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Exceptions
{
    /// <summary>
    ///     Represents a 'friendly ' bad request exception.
    /// </summary>
    public sealed class BadRequestStewardException : StewardBaseException
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="BadRequestStewardException"/> class.
        /// </summary>
        public BadRequestStewardException()
            : base()
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="BadRequestStewardException"/> class.
        /// </summary>
        public BadRequestStewardException(string message)
            : base(message)
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="BadRequestStewardException"/> class.
        /// </summary>
        public BadRequestStewardException(string message, Exception innerException)
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
        public override StewardErrorCode ErrorCode => StewardErrorCode.BadRequest;
    }
}
