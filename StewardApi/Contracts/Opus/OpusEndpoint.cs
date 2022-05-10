namespace Turn10.LiveOps.StewardApi.Contracts.Opus
{
    /// <summary>
    ///     Represents an endpoint for use by Opus service wrapper.
    /// </summary>
    public sealed class OpusEndpoint
    {
        /// <summary>
        ///     Gets Opus Retail LSP endpoint.
        /// </summary>
        public static string Retail => "https://serverservices.fh3.forzamotorsport.net/ServerServices.FH3Release/o.xtsw";
    }
}
