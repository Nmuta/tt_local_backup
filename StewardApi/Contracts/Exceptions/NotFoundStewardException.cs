using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Exceptions
{
    /// <summary>
    ///     Represents a profile not found exception.
    /// </summary>
    public sealed class NotFoundStewardException : StewardBaseException
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="NotFoundStewardException"/> class.
        /// </summary>
        public NotFoundStewardException()
            : base()
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="NotFoundStewardException"/> class.
        /// </summary>
        /// <param name="message">The message.</param>
        public NotFoundStewardException(string message)
            : base(message)
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="NotFoundStewardException"/> class.
        /// </summary>
        /// <param name="message">The message.</param>
        /// <param name="innerException">The inner exception.</param>
        public NotFoundStewardException(string message, Exception innerException)
            : base(message, innerException)
        {
        }
    }
}
