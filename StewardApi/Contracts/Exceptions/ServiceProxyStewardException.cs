using System;
using System.Net;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Exceptions
{
    /// <summary>
    ///     Represents a 'friendly ' bad header exception.
    /// </summary>
    public sealed class ServiceProxyStewardException : StewardBaseException
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="ServiceProxyStewardException"/> class.
        /// </summary>
        public ServiceProxyStewardException()
            : base()
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="ServiceProxyStewardException"/> class.
        /// </summary>
        public ServiceProxyStewardException(string message)
            : base(message)
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="ServiceProxyStewardException"/> class.
        /// </summary>
        public ServiceProxyStewardException(string message, Exception innerException)
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
        public override StewardErrorCode ErrorCode => StewardErrorCode.ServiceProxyError;
    }
}
