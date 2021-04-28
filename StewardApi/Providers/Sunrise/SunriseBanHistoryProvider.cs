﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Turn10.Data.Common;
using Turn10.Data.Kusto;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Sunrise;
using Turn10.LiveOps.StewardApi.Providers.Data;

namespace Turn10.LiveOps.StewardApi.Providers.Sunrise
{
    /// <inheritdoc />
    public sealed class SunriseBanHistoryProvider : ISunriseBanHistoryProvider
    {
        private static readonly IList<string> RequiredSettings = new List<string>
        {
            ConfigurationKeyConstants.KustoLoggerDatabase
        };

        private readonly IKustoStreamingLogger kustoStreamingLogger;
        private readonly IKustoProvider kustoProvider;
        private readonly string kustoDatabase;

        /// <summary>
        ///     Initializes a new instance of the <see cref="SunriseBanHistoryProvider"/> class.
        /// </summary>
        public SunriseBanHistoryProvider(IKustoStreamingLogger kustoStreamingLogger, IKustoProvider kustoProvider, IConfiguration configuration)
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
        public async Task UpdateBanHistoryAsync(ulong xuid, string title, string requestingAgent, SunriseBanParameters banParameters)
        {
            requestingAgent.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requestingAgent));
            title.ShouldNotBeNullEmptyOrWhiteSpace(nameof(title));
            banParameters.ShouldNotBeNull(nameof(banParameters));

            // Gamertags must be set to null for NGP. v-joyate 20201123
            var sanitizedBanParameters = new SunriseBanParameters
            {
                Xuids = banParameters.Xuids,
                Gamertags = null,
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
                requestingAgent,
                banParameters.StartTimeUtc,
                banParameters.ExpireTimeUtc,
                banParameters.FeatureArea,
                banParameters.Reason,
                sanitizedBanParameters.ToJson());

            var kustoColumnMappings = banHistory.ToJsonColumnMappings();
            var tableName = "BanHistory";
            var banHistories = new List<LiveOpsBanHistory> { banHistory };

            await this.kustoStreamingLogger.IngestFromStreamAsync(banHistories, this.kustoDatabase, tableName, kustoColumnMappings).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<IList<LiveOpsBanHistory>> GetBanHistoriesAsync(ulong xuid, string title)
        {
            title.ShouldNotBeNullEmptyOrWhiteSpace(nameof(title));

            try
            {
                var banHistoryResult = await this.kustoProvider.GetBanHistoryAsync(xuid, title).ConfigureAwait(false);
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
