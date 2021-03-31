using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Exceptions
{
    /// <summary>
    ///     Represents an unknown failure exception.
    /// </summary>
    public sealed class UnknownFailureStewardException : StewardBaseException
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="UnknownFailureStewardException"/> class.
        /// </summary>
        public UnknownFailureStewardException()
            : base()
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="UnknownFailureStewardException"/> class.
        /// </summary>
        public UnknownFailureStewardException(string message)
            : base(message)
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="UnknownFailureStewardException"/> class.
        /// </summary>
        public UnknownFailureStewardException(string message, Exception innerException)
            : base(message, innerException)
        {
        }
    }
}