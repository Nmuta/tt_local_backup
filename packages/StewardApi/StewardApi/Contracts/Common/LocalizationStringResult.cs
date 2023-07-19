using SteelheadLiveOpsContent;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents the results of localization requests.
    /// </summary>
    public sealed class LocalizationStringResult
    {
        /// <summary>
        ///     Gets or sets the max length.
        /// </summary>
        public int MaxLength { get; set; }

        /// <summary>
        ///     Gets or sets the category.
        /// </summary>
        /// <remarks><see cref="LocCategory" />.</remarks>
        public LocCategory Category { get; set; }

        /// <summary>
        ///     Gets or sets the sub-category.
        /// </summary>
        /// <remarks><see cref="LocSubCategory" />.</remarks>
        public LocSubCategory SubCategory { get; set; }

        /// <summary>
        ///     Gets or sets the Localized String.
        /// </summary>
        public string LocalizedString { get; set; }
    }
}
