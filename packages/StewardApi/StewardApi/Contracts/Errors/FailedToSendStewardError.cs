using System;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Errors
{
    /// <summary>
    ///     Represents an error with uploading.
    /// </summary>
    public sealed class FailedToSendStewardError : StewardError
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="FailedToSendStewardError"/> class.
        /// </summary>
        public FailedToSendStewardError()
            : base()
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="FailedToSendStewardError"/> class.
        /// </summary>
        public FailedToSendStewardError(string message)
            : base(message)
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="FailedToSendStewardError"/> class.
        /// </summary>
        public FailedToSendStewardError(string message, Exception innerException)
            : base(message, innerException)
        {
        }

        /// <summary>
        ///     Gets the status code.
        /// </summary>
        public override StewardErrorCode Code => StewardErrorCode.FailedToSend;
    }
}