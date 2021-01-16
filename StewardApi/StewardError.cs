using Turn10.Data.Common;

namespace Turn10.LiveOps.StewardApi
{
    /// <summary>
    ///     Represents an error in Steward.
    /// </summary>
    public sealed class StewardError
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="StewardError"/> class.
        /// </summary>
        public StewardError()
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="StewardError"/> class.
        /// </summary>
        /// <param name="code">The code.</param>
        /// <param name="message">The message.</param>
        public StewardError(StewardErrorCode code, string message)
        {
            code.ShouldNotBeNull(nameof(code));
            message.ShouldNotBeNullEmptyOrWhiteSpace(nameof(message));

            this.Code = code;
            this.Message = message;
        }

        /// <summary>
        ///     Gets or sets the code.
        /// </summary>
        public StewardErrorCode Code { get; set; }

        /// <summary>
        ///     Gets or sets the message.
        /// </summary>
        public string Message { get; set; }
    }
}
