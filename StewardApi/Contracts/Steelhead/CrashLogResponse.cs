namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead
{
    /// <summary>
    ///     Represents the response from decoding a client crash log.
    /// </summary>
    public class CrashLogResponse
    {
        /// <summary>
        ///     Gets or sets the decoded text from the client crash log.
        /// </summary>
        public string DecodedLog { get; set; }
    }
}
