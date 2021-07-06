using System;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Errors
{
    /// <summary>
    ///     Represents an error finding a document.
    /// </summary>
    public sealed class NotFoundStewardError : StewardError
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="NotFoundStewardError"/> class.
        /// </summary>
        public NotFoundStewardError()
            : base()
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="NotFoundStewardError"/> class.
        /// </summary>
        public NotFoundStewardError(string message)
            : base(message)
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="NotFoundStewardError"/> class.
        /// </summary>
        public NotFoundStewardError(string message, Exception innerException)
            : base(message, innerException)
        {
        }

        /// <summary>
        ///     Gets the status code.
        /// </summary>
        public override StewardErrorCode Code => StewardErrorCode.DocumentNotFound;
    }
}