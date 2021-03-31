using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Exceptions
{
    /// <summary>
    ///     Represents a profile not found exception.
    /// </summary>
    public class StewardBaseException : Exception
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="StewardBaseException"/> class.
        /// </summary>
        public StewardBaseException()
            : base()
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="StewardBaseException"/> class.
        /// </summary>
        public StewardBaseException(string message)
            : base(message)
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="StewardBaseException"/> class.
        /// </summary>
        public StewardBaseException(string message, Exception innerException)
            : base(message, innerException)
        {
        }
    }
}