using System;
using System.Net;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Exceptions
{
    /// <summary>
    ///     Represents an abstract 'friendly' exception.
    /// </summary>
    public abstract class StewardBaseException : Exception
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="StewardBaseException"/> class.
        /// </summary>
        protected StewardBaseException()
            : base()
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="StewardBaseException"/> class.
        /// </summary>
        protected StewardBaseException(string message)
            : base(message)
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="StewardBaseException"/> class.
        /// </summary>
        protected StewardBaseException(string message, Exception innerException)
            : base(message, innerException)
        {
        }

        /// <summary>
        ///     Gets the status code.
        /// </summary>
        public abstract HttpStatusCode StatusCode { get; }

        /// <summary>
        ///     Gets the error code.
        /// </summary>
        public abstract StewardErrorCode ErrorCode { get; }
    }
}