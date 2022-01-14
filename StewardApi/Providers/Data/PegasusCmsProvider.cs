using Turn10.Services.CMSRetrieval;

namespace Turn10.LiveOps.StewardApi.Providers.Data
{
    /// <summary>
    ///     Exposes CMSRetrievalHelpers for each available title.
    /// </summary>
    public sealed class PegasusCmsProvider
    {
        /// <summary>
        ///     Gets or sets the Pegasus CMS retrieval instance for FH5.
        /// </summary>
        public CMSRetrievalHelper WoodstockCmsRetrievalHelper { get; set; }

        /// <summary>
        ///     Gets or sets the Pegasus CMS retrieval instance for FH4.
        /// </summary>
        public CMSRetrievalHelper SunriseCmsRetrievalHelper { get; set; }
    }
}
