using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents the possible auction review states.
    /// </summary>
    /// <remarks>
    ///     Matches values with Services enum ForzaAuctionStatus.
    /// </remarks>
    [JsonConverter(typeof(StringEnumConverter))]
    public enum AuctionReviewState
    {
        /// <summary>
        ///     Default review state.
        /// </summary>
        Default = 0,

        /// <summary>
        ///     Auction is flagged for review.
        /// </summary>
        FlaggedForReview = 1,

        /// <summary>
        ///     Auction has been removed by an admin.
        /// </summary>
        AdminRemoved = 2,

        /// <summary>
        ///     Auction has been approved by an admin.
        /// </summary>
        AdminApproved = 3,
    }
}
