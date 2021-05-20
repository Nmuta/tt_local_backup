using System.Collections.Generic;
using System.Linq;
using Turn10.LiveOps.StewardApi.Contracts;

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
        public static BackgroundJobStatus GetBackgroundJobStatus<T>(
            IList<GiftResponse<T>> results)
        {
            var foundErrors = results.Any(gift => gift.Error != null);
            return foundErrors ? BackgroundJobStatus.CompletedWithErrors : BackgroundJobStatus.Completed;
        }

        /// <summary>
        ///     Generates a background job status based on a list of ban responses.
        /// </summary>
        public static BackgroundJobStatus GetBackgroundJobStatus(
            IList<BanResult> results)
        {
            var foundErrors = results.Any(ban => !ban.Success);
            return foundErrors ? BackgroundJobStatus.CompletedWithErrors : BackgroundJobStatus.Completed;
        }
    }
}
