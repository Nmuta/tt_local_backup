using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Exceptions
{
    /// <summary>
    ///     Represents a 'friendly' conflict exception.
    /// </summary>
    public sealed class ConflictStewardException : StewardBaseException
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="ConflictStewardException"/> class.
        /// </summary>
        public ConflictStewardException()
            : base()
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="ConflictStewardException"/> class.
        /// </summary>
        public ConflictStewardException(string message)
            : base(message)
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="ConflictStewardException"/> class.
        /// </summary>
        public ConflictStewardException(string message, Exception innerException)
            : base(message, innerException)
        {
        }
    }
}
