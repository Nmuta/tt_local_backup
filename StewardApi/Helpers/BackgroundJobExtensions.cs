using System.Collections.Generic;
using System.Linq;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Helpers
{
    /// <summary>
    ///     Contains assorted extension methods for use in Steward.
    /// </summary>
    public static class BackgroundJobExtensions
    {
        /// <summary>
        ///     Generates a background job status based on a list of gift responses.
        /// </summary>
        /// <typeparam name="T">Type of the value in the <see cref="GiftResponse{T}"/> to be returned.</typeparam>
        public static BackgroundJobStatus GetBackgroundJobStatus<T>(
            IList<GiftResponse<T>> results)
        {
            var foundErrors = results.Any(gift => gift.Errors.Count > 0);
            return foundErrors ? BackgroundJobStatus.CompletedWithErrors : BackgroundJobStatus.Completed;
        }

        /// <summary>
        ///     Generates a background job status based on a list of ban responses.
        /// </summary>
        public static BackgroundJobStatus GetBackgroundJobStatus(
            IList<BanResult> results)
        {
            var foundErrors = results.Any(ban => ban.Error != null);
            return foundErrors ? BackgroundJobStatus.CompletedWithErrors : BackgroundJobStatus.Completed;
        }
    }
}
