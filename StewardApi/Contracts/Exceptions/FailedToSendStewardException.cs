using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Exceptions
{
    /// <summary>
    ///     Represents a failed to send Steward exception.
    /// </summary>
    public sealed class FailedToSendStewardException : StewardBaseException
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="FailedToSendStewardException"/> class.
        /// </summary>
        public FailedToSendStewardException()
            : base()
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="FailedToSendStewardException"/> class.
        /// </summary>
        /// <param name="message">The message.</param>
        public FailedToSendStewardException(string message)
            : base(message)
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="FailedToSendStewardException"/> class.
        /// </summary>
        /// <param name="message">The message.</param>
        /// <param name="innerException">The inner exception.</param>
        public FailedToSendStewardException(string message, Exception innerException)
            : base(message, innerException)
        {
        }
    }
}
