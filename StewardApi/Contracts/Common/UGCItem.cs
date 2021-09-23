using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a UGC item.
    /// </summary>
    public sealed class UGCItem
    {
        /// <summary>
        ///     Gets or sets the Id.
        /// </summary>
        public string Id { get; set; }

        /// <summary>
        ///     Gets or sets the Guid Id.
        /// </summary>
        public Guid GuidId { get; set; }

        /// <summary>
        ///     Gets or sets the UGC type.
        /// </summary>
        public UGCType Type { get; set; }

        /// <summary>
        ///     Gets or sets the game title.
        /// </summary>
        public int GameTitle { get; set; }

        /// <summary>
        ///     Gets or sets the owner XUID.
        /// </summary>
        public ulong Owner { get; set; }

        /// <summary>
        ///     Gets or sets the popularity bucket.
        /// </summary>
        public byte PopularityBucket { get; set; }

        /// <summary>
        ///     Gets or sets the first thumbnail.
        /// </summary>
        public string ThumbnailImageOneBase64 { get; set; }

        /// <summary>
        ///     Gets or sets the second thumbnail.
        /// </summary>
        public string ThumbnailImageTwoBase64 { get; set; }

        /// <summary>
        ///     Gets or sets the first keyword.
        /// </summary>
        /// <remarks>Property relates to in-game tagging that can be applied by the item's owner.</remarks>
        public int KeywordIdOne { get; set; }

        /// <summary>
        ///     Gets or sets the second keyword.
        /// </summary>
        /// <remarks>Property relates to in-game tagging that can be applied by the item's owner.</remarks>
        public int KeywordIdTwo { get; set; }

        /// <summary>
        ///     Gets or sets the car description.
        /// </summary>
        public string CarDescription { get; set; }

        /// <summary>
        ///     Gets or sets the make id.
        /// </summary>
        public int MakeId { get; set; }

        /// <summary>
        ///     Gets or sets the car id.
        /// </summary>
        public int CarId { get; set; }

        /// <summary>
        ///     Gets or sets the reporting state.
        /// </summary>
        public int ReportingState { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether the item is searchable.
        /// </summary>
        public bool Searchable { get; set; }

        /// <summary>
        ///     Gets or sets the force featured end date.
        /// </summary>
        public DateTime ForceFeaturedEndDateUtc { get; set; }

        /// <summary>
        ///     Gets or sets the featured end date.
        /// </summary>
        public DateTime FeaturedEndDateUtc { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether the item is featured by T10.
        /// </summary>
        public bool FeaturedByT10 { get; set; }

        /// <summary>
        ///     Gets or sets the title.
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        ///     Gets or sets the description.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        ///     Gets or sets the created date.
        /// </summary>
        public DateTime CreatedDateUtc { get; set; }

        /// <summary>
        ///     Gets or sets the share code.
        /// </summary>
        public string ShareCode { get; set; }

        /// <summary>
        ///     Gets or sets the number of times the item was disliked.
        /// </summary>
        public int TimesDisliked { get; set; }

        /// <summary>
        ///     Gets or sets the number of times the item was used.
        /// </summary>
        public int TimesUsed { get; set; }

        /// <summary>
        ///     Gets or sets the number of times the item was liked.
        /// </summary>
        public int TimesLiked { get; set; }

        /// <summary>
        ///     Gets or sets the number of times the item was downloaded.
        /// </summary>
        public int TimesDownloaded { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether the UGC item is public.
        /// </summary>
        public bool IsPublic { get; set; }
    }
}
