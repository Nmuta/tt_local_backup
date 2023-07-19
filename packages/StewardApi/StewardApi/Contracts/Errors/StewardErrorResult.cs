namespace Turn10.LiveOps.StewardApi.Contracts.Errors
{
    /// <summary>
    ///     Represents the result returned in the event of an exception.
    /// </summary>
    public sealed class StewardErrorResult
    {
        /// <summary>
        ///     Gets or sets the message.
        /// </summary>
        public StewardError Error { get; set; }
    }
}
