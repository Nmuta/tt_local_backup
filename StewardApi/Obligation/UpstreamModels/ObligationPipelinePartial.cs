namespace Turn10.LiveOps.StewardApi.Obligation.UpstreamModels
{
    /// <summary>
    ///     A partial deserialization of the Obligation Pipelines GET response.
    /// </summary>
    public sealed class ObligationPipelinePartial
    {
        /// <summary>
        ///     Gets or sets the name.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        ///     Gets or sets the status.
        /// </summary>
        public string Status { get; set; }
    }
}
