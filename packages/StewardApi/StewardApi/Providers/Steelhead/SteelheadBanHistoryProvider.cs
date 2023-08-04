using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Turn10.Data.Common;
using Turn10.Data.Kusto;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Providers.Data;

namespace Turn10.LiveOps.StewardApi.Providers.Steelhead
{
    /// <inheritdoc />
    public sealed class SteelheadBanHistoryProvider : ISteelheadBanHistoryProvider
    {
        private static readonly IList<string> RequiredSettings = new List<string>
        {
            ConfigurationKeyConstants.KustoLoggerDatabase
        };

        private readonly IKustoStreamingLogger kustoStreamingLogger;
        private readonly IKustoProvider kustoProvider;
        private readonly string kustoDatabase;

        /// <summary>
        ///     Initializes a new instance of the <see cref="SteelheadBanHistoryProvider"/> class.
        /// </summary>
        public SteelheadBanHistoryProvider(
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
        public async Task UpdateBanHistoryAsync(
            ulong xuid,
            string title,
            string requesterObjectId,
            SteelheadBanParameters banParameters,
            string endpoint)
        {
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));
            title.ShouldNotBeNullEmptyOrWhiteSpace(nameof(title));
            banParameters.ShouldNotBeNull(nameof(banParameters));
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            // Gamertags must be set to null for NGP. v-joyate 20201123
            var sanitizedBanParameters = new SteelheadBanParameters
            {
                Xuid = banParameters.Xuid,
                Gamertag = null,
                BanAllConsoles = banParameters.BanAllConsoles,
                BanAllPcs = banParameters.BanAllPcs,
                DeleteLeaderboardEntries = banParameters.DeleteLeaderboardEntries,
                SendReasonNotification = banParameters.SendReasonNotification,
                Reason = banParameters.Reason,
                FeatureArea = banParameters.FeatureArea,
                StartTimeUtc = banParameters.StartTimeUtc,
                ExpireTimeUtc = banParameters.ExpireTimeUtc
            };

            var banHistory = new LiveOpsBanHistory(
                (long)xuid,
                title,
                requesterObjectId,
                banParameters.StartTimeUtc,
                banParameters.ExpireTimeUtc,
                banParameters.FeatureArea,
                banParameters.Reason,
                sanitizedBanParameters.ToJson(),
                endpoint);

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
        public async Task<IList<LiveOpsBanHistory>> GetBanHistoriesAsync(ulong xuid, string title, string endpoint)
        {
            title.ShouldNotBeNullEmptyOrWhiteSpace(nameof(title));
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                var banHistoryResult = await this.kustoProvider.GetBanHistoryAsync(xuid, title, endpoint)
                    .ConfigureAwait(false);
                var results = banHistoryResult.ToList();

                results.Sort((x, y) => DateTime.Compare(y.ExpireTimeUtc, x.ExpireTimeUtc));

                return results;
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No history found for XUID: {xuid} in Title: {title}.", ex);
            }
        }
    }
}
