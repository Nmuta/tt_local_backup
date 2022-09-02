using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.Services.Orm.SqlGen;

namespace Turn10.LiveOps.StewardApi.Helpers
{
    /// <summary>
    ///     Contains assorted extension methods for use in Steward.
    /// </summary>
    public static class BackgroundJobHelpers
    {
        /// <summary>
        ///     Generates a background job status based on a multi-list of gift responses.
        /// </summary>
        /// <typeparam name="T">Type of the value in the <see cref="GiftResponse{T}"/> to be returned.</typeparam>
        public static BackgroundJobStatus GetBackgroundJobStatus<T>(
            IList<IList<GiftResponse<T>>> results)
        {
            var foundErrors = results.SelectMany(g => g).Any(gift => gift.Errors.Count > 0);
            return foundErrors ? BackgroundJobStatus.CompletedWithErrors : BackgroundJobStatus.Completed;
        }

        /// <summary>
        ///     Merges a set of gift responses.
        /// </summary>
        /// <typeparam name="T">Type of the value in the <see cref="GiftResponse{T}"/> to be returned.</typeparam>
        public static IList<GiftResponse<T>> MergeResponses<T>(
            IList<IList<GiftResponse<T>>> results)
        {
            var flatResults = results.SelectMany(v => v);
            var userFlatResults = flatResults.Where(r => r.PlayerXuid.HasValue && !r.LspGroup.HasValue);
            var lspFlatResults = flatResults.Where(r => r.LspGroup.HasValue && !r.PlayerXuid.HasValue);
            var badFlatResults = flatResults.Where(r =>
            {
                var neitherValue = !r.PlayerXuid.HasValue && !r.LspGroup.HasValue;
                var bothValues = r.PlayerXuid.HasValue && r.LspGroup.HasValue;
                return neitherValue || bothValues;
            });

            GiftResponse<T> DoAggregate<T2>(IGrouping<T2, GiftResponse<T>> g) {
                var list = g.ToList();
                var first = list.First();
                return new GiftResponse<T>
                {
                    PlayerOrLspGroup = first.PlayerOrLspGroup,
                    PlayerXuid = first.PlayerXuid,
                    LspGroup = first.LspGroup,
                    IdentityAntecedent = first.IdentityAntecedent,
                    Errors = list.SelectMany(r => r.Errors).ToList(),
                };
            }

            var groupedUsers = userFlatResults.GroupBy(r => r.PlayerXuid.Value).Select(g => DoAggregate(g)).ToList();
            var groupedLspGroups = userFlatResults.GroupBy(r => r.LspGroup.Value).Select(g => DoAggregate(g)).ToList();
            return groupedUsers.Concat(groupedLspGroups).Concat(badFlatResults).ToList();
        }

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

        /// <summary>
        ///     Generates a background job status based on a list of user group management (add/remove) responses.
        /// </summary>
        public static BackgroundJobStatus GetBackgroundJobStatus(
            IList<BasicPlayer> results)
        {
            var foundErrors = results.Any(basicPlayer => basicPlayer.Error != null);
            return foundErrors ? BackgroundJobStatus.CompletedWithErrors : BackgroundJobStatus.Completed;
        }

        /// <summary>
        ///     Generate a CreatedResult to be returned by the controller for background jobs.
        /// </summary>
        public static CreatedResult GetCreatedResult(Func<Uri, object?, CreatedResult> createdResultMethod, string scheme, HostString host, string jobId)
        {
            return createdResultMethod(
                new Uri($"{scheme}://{host}/api/v1/jobs/jobId({jobId})"),
                new BackgroundJob(jobId, BackgroundJobStatus.InProgress));
        }
    }
}
