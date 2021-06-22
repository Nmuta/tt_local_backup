using System;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Errors
{
    /// <summary>
    ///     Represents an error with provided arguments.
    /// </summary>`
    public sealed class InvalidArgumentsStewardError : StewardError
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="InvalidArgumentsStewardError"/> class.
        /// </summary>
        public InvalidArgumentsStewardError()
            : base()
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="InvalidArgumentsStewardError"/> class.
        /// </summary>
        public InvalidArgumentsStewardError(string message)
            : base(message)
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="InvalidArgumentsStewardError"/> class.
        /// </summary>
        public InvalidArgumentsStewardError(string message, Exception innerException)
            : base(message, innerException)
        {
        }

        /// <summary>
        ///     Gets the status code.
        /// </summary>
        public override StewardErrorCode Code => StewardErrorCode.RequiredParameterMissing;
    }
}