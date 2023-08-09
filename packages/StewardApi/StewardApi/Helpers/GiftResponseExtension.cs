using System.Collections.Generic;
using System.Linq;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Helpers
{
    /// <summary>
    ///     Helpers for operation on GiftResponse.
    /// </summary>
    public static class GiftResponseExtension
    {
        /// <summary>
        ///     Merge a list of GiftResponse assumed to be for the same group into a single GiftResponse.
        /// </summary>
        /// <typeparam name="T">The target type.</typeparam>
        public static GiftResponse<T> MergeGiftResponse<T>(this IList<GiftResponse<T>> source)
        {
            var first = source.First();
            var response = new GiftResponse<T>
            {
                PlayerOrLspGroup = first.PlayerOrLspGroup,
                TargetXuid = first.TargetXuid,
                TargetLspGroupId = first.TargetLspGroupId,
                IdentityAntecedent = first.IdentityAntecedent,
                Errors = source.Where(r => r.Errors != null).SelectMany(r => r.Errors).ToList(),
            };

            return response;
        }
    }
}
