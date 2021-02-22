using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Exceptions
{
    /// <summary>
    ///     Represents an invalid argument exception.
    /// </summary>
    public sealed class InvalidArgumentsStewardException : StewardBaseException
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="InvalidArgumentsStewardException"/> class.
        /// </summary>
        public InvalidArgumentsStewardException()
            : base()
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="InvalidArgumentsStewardException"/> class.
        /// </summary>
        /// <param name="message">The message.</param>
        public InvalidArgumentsStewardException(string message)
            : base(message)
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="InvalidArgumentsStewardException"/> class.
        /// </summary>
        /// <param name="message">The message.</param>
        /// <param name="innerException">The inner exception.</param>
        public InvalidArgumentsStewardException(string message, Exception innerException)
            : base(message, innerException)
        {
        }
    }
}