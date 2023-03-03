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
                    banSummaryResults.Add(new BanSummary()
                    {
                        BanCount = banHistoryResult.Count,
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
