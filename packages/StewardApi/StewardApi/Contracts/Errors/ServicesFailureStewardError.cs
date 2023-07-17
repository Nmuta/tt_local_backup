using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Errors
{
    /// <summary>
    ///     Represents an error with Services request.
    /// </summary>
    public sealed class ServicesFailureStewardError : StewardError
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="ServicesFailureStewardError"/> class.
        /// </summary>
        public ServicesFailureStewardError()
            : base()
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="ServicesFailureStewardError"/> class.
        /// </summary>
        public ServicesFailureStewardError(string message)
            : base(message)
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="ServicesFailureStewardError"/> class.
        /// </summary>
        public ServicesFailureStewardError(string message, object innerException)
            : base(message, innerException)
        {
        }

        /// <summary>
        ///     Gets the status code.
        /// </summary>
        public override StewardErrorCode Code => StewardErrorCode.ServicesFailure;
    }
}