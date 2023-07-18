using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Turn10.Data.Common;
using Turn10.Data.Kusto;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;

namespace Turn10.LiveOps.StewardApi.Providers.Data
{
    /// <inheritdoc />
    public sealed class ForumBanHistoryProvider : IForumBanHistoryProvider
    {
        private static readonly IList<string> RequiredSettings = new List<string>
        {
            ConfigurationKeyConstants.KustoLoggerDatabase
        };

        private readonly string forumDefaultEndpoint = string.Empty;
        private readonly IKustoStreamingLogger kustoStreamingLogger;
        private readonly IKustoProvider kustoProvider;
        private readonly string kustoDatabase;

        /// <summary>
        ///     Initializes a new instance of the <see cref="ForumBanHistoryProvider"/> class.
        /// </summary>
        public ForumBanHistoryProvider(
            IKustoStreamingLogger kustoStreamingLogger,
            IKustoProvider kustoProvider,
            IConfiguration configuration)
        {
            kustoStreamingLogger.ShouldNotBeNull(nameof(kustoStreamingLogger));
            kustoProvider.ShouldNotBeNull(nameof(kustoProvider));
            configuration.ShouldNotBeNull(nameof(configuration));
            configuration.ShouldContainSettings(RequiredSettings);

            this.kustoStreamingLogger = kustoStreamingLogger;
            this.kustoProvider = kustoProvider;
            this.kustoDatabase = configuration[ConfigurationKeyConstants.KustoLoggerDatabase];
        }

        /// <inheritdoc />
        public async Task CreateForumBanHistoryAsync(
            ulong xuid,
            ForumBanParametersInput banParameters,
            string requesterObjectId)
        {
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));

            var banHistory = new LiveOpsBanHistory()
            {
                Xuid = (long)xuid,
                Title = TitleConstants.Forum,
                RequesterObjectId = requesterObjectId,
                Reason = banParameters.Reason,
                StartTimeUtc = banParameters.IssuedDateUtc,
                FeatureArea = TitleConstants.Forum,
                BanParameters = "N/A",
                Endpoint = this.forumDefaultEndpoint
            };

            var kustoColumnMappings = banHistory.ToJsonColumnMappings();
            var tableName = "BanHistory";
            var banHistories = new List<LiveOpsBanHistory> { banHistory };

            await this.kustoStreamingLogger.IngestFromStreamAsync(
                banHistories,
                this.kustoDatabase,
                tableName,
                kustoColumnMappings).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<IList<LiveOpsBanHistory>> GetForumBanHistoriesAsync(ulong xuid)
        {
            try
            {
                var banHistoryResult = await this.kustoProvider.GetBanHistoryAsync(xuid, TitleConstants.Forum, this.forumDefaultEndpoint)
                    .ConfigureAwait(false);
                var results = banHistoryResult.ToList();

                results.Sort((x, y) => DateTime.Compare(y.StartTimeUtc, x.StartTimeUtc));

                return results;
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to get forum ban history. (xuid: {xuid})", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IList<BanSummary>> GetUserBanSummariesAsync(IList<ulong> xuids)
        {
            try
            {
                var banSummaryResults = new List<BanSummary>();
                if (xuids.Count == 0)
                {
                    return banSummaryResults;
                }

                foreach (var xuid in xuids)
                {
                    var banHistoryResult = await this.kustoProvider.GetBanHistoryAsync(xuid, TitleConstants.Forum, this.forumDefaultEndpoint).ConfigureAwait(false);

                    // A player’s offense count is reduced by 1 for every 6 month period without an offense (minimum of 0).
                    // Order the dates from oldest to most recent
                    var banDates = banHistoryResult.Select(x => x.StartTimeUtc).OrderBy(x => x).ToList();
                    var adjustedBanCount = 0;
                    if (banDates.Any())
                    {
                        var oldestBanDate = banDates.First();
                        // Add today to the banDates list to calculate difference between today and most recent ban
                        banDates.Add(DateTime.Now);
                        // Loop through the banDates starting from the second
                        for (int i = 1; i < banDates.Count - 1; i++)
                        {
                            // Increase ban count
                            adjustedBanCount += 1;
                            // Count the number of 6 months period between this ban and the next most recent ban (or today if this is the most recent ban)
                            var numberOf6Months = (int)(banDates[i] - banDates[i - 1]).TotalDays / 180;
                            adjustedBanCount -= numberOf6Months;
                            // Ban count can't go under 0
                            adjustedBanCount = Math.Max(0, adjustedBanCount);
                        }
                    }

                    banSummaryResults.Add(new BanSummary()
                    {
                        BanCount = banHistoryResult.Count,
                        AdjustedBanCount = adjustedBanCount,
                        Xuid = xuid
                    });
                }

                return banSummaryResults;
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException("Ban Summary lookup has failed.", ex);
            }
        }
    }
}
