using System;

#pragma warning disable SA1516 // Blank Lines
#pragma warning disable SA1600 // Elements must be documented
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member
#pragma warning disable SA1604 // Elements comment should have summary

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a UGC item.
    /// </summary>
    public class UgcItem
    {
        public Guid Id { get; set; }
        public UgcType Type { get; set; }
        public int GameTitle { get; set; }
        public ulong OwnerXuid { get; set; }
        public string OwnerGamertag { get; set; }
        public byte PopularityBucket { get; set; }
        public string ThumbnailOneImageBase64 { get; set; }
        public string ThumbnailTwoImageBase64 { get; set; }
        public string CarDescription { get; set; }
        public int MakeId { get; set; }
        public int CarId { get; set; }
        public ForzaReportingState ReportingState { get; set; }
        public DateTime? ForceFeaturedEndDateUtc { get; set; }
        public DateTime? FeaturedEndDateUtc { get; set; }
        public bool FeaturedByT10 { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime CreatedDateUtc { get; set; }
        public string ShareCode { get; set; }
        public int TimesDisliked { get; set; }
        public int TimesUsed { get; set; }
        public int TimesLiked { get; set; }
        public int TimesDownloaded { get; set; }
        public bool IsHidden { get; set; }
        public DateTime HiddenTimeUtc { get; set; }

        /// <remarks>Mapped from 'Searchable' property on LSP.</remarks>
        public bool IsPublic { get; set; }

        /// <remarks>Property relates to in-game tagging that can be applied by the item's owner.</remarks>
        public int KeywordIdOne { get; set; }

        /// <remarks>Property relates to in-game tagging that can be applied by the item's owner.</remarks>
        public int KeywordIdTwo { get; set; }
    }
}
