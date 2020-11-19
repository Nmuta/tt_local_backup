using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.Extensions.Configuration;
using Turn10.Data.Common;
using Turn10.Data.Kusto;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Gravity;
using Turn10.LiveOps.StewardApi.Contracts.Legacy;

namespace Turn10.LiveOps.StewardApi.Providers.Gravity
{
    /// <inheritdoc />
    public sealed class GravityGiftHistoryProvider : IGravityGiftHistoryProvider
    {
        private static readonly IList<string> RequiredSettings = new List<string>
        {
            ConfigurationKeyConstants.KustoLoggerDatabase
        };

        private readonly IKustoStreamingLogger kustoStreamingLogger;
        private readonly IKustoProvider kustoProvider;
        private readonly IMapper mapper;
        private readonly string kustoDatabase;

        /// <summary>
        ///     Initializes a new instance of the <see cref="GravityGiftHistoryProvider"/> class.
        /// </summary>
        /// <param name="kustoStreamingLogger">The Kusto streaming logger.</param>
        /// <param name="kustoProvider">The Kusto provider.</param>
        /// <param name="configuration">The configuration.</param>
        /// <param name="mapper">The mapper.</param>
        public GravityGiftHistoryProvider(IKustoStreamingLogger kustoStreamingLogger, IKustoProvider kustoProvider, IConfiguration configuration, IMapper mapper)
        {
            kustoStreamingLogger.ShouldNotBeNull(nameof(kustoStreamingLogger));
            kustoProvider.ShouldNotBeNull(nameof(kustoProvider));
            configuration.ShouldNotBeNull(nameof(configuration));
            mapper.ShouldNotBeNull(nameof(mapper));
            configuration.ShouldContainSettings(RequiredSettings);

            this.kustoStreamingLogger = kustoStreamingLogger;
            this.kustoProvider = kustoProvider;
            this.kustoDatabase = configuration[ConfigurationKeyConstants.KustoLoggerDatabase];
            this.mapper = mapper;
        }

        /// <inheritdoc />
        public async Task UpdateGiftHistoryAsync(string id, string title, string requestingAgent, GiftHistoryAntecedent giftHistoryAntecedent, GravityPlayerInventory playerInventory)
        {
            id.ShouldNotBeNullEmptyOrWhiteSpace(nameof(id));
            title.ShouldNotBeNullEmptyOrWhiteSpace(nameof(title));
            requestingAgent.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requestingAgent));
            playerInventory.ShouldNotBeNull(nameof(playerInventory));
            requestingAgent.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requestingAgent));

            var playerId = $"{giftHistoryAntecedent}:{id}";
            var giftHistory = new GiftHistory(playerId, title, requestingAgent, DateTime.UtcNow, playerInventory.ToJson());
            var kustoColumnMappings = giftHistory.ToJsonColumnMappings();
            var tableName = typeof(GiftHistory).Name;
            var giftHistories = new List<GiftHistory> { giftHistory };

            await this.kustoStreamingLogger.IngestFromStreamAsync(giftHistories, this.kustoDatabase, tableName, kustoColumnMappings).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<IList<GravityGiftHistory>> GetGiftHistoriesAsync(string id, string title, GiftHistoryAntecedent giftHistoryAntecedent)
        {
            id.ShouldNotBeNullEmptyOrWhiteSpace(nameof(id));
            title.ShouldNotBeNullEmptyOrWhiteSpace(nameof(title));

            var playerId = $"{giftHistoryAntecedent}:{id}";

            return await this.GetGiftHistoriesAsync(playerId, title).ConfigureAwait(false);
        }

        private async Task<IList<GravityGiftHistory>> GetGiftHistoriesAsync(string playerId, string title)
        {
            playerId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(playerId));
            title.ShouldNotBeNullEmptyOrWhiteSpace(nameof(title));

            var giftHistoryResult = await this.kustoProvider.GetGiftHistoryAsync(playerId, title).ConfigureAwait(false);
            var results = new List<GravityGiftHistory>();

            foreach (var history in giftHistoryResult)
            {
                GravityPlayerInventory convertedInventory;
                // The below logic is in place because V1 inventories are still being uploaded by V1 Zendesk.
                // It can be removed once V1 endpoints are no longer uploading data into the table.
                try
                {
                    convertedInventory = history.GiftInventory.FromJson<GravityPlayerInventory>();
                }
                catch
                {
                    var oldInventory = history.GiftInventory.FromJson<PlayerInventory>();
                    convertedInventory = this.mapper.Map<GravityPlayerInventory>(oldInventory);
                }

                results.Add(new GravityGiftHistory(history.PlayerId, history.Title, history.RequestingAgent, history.GiftSendDateUtc, convertedInventory));
            }

            results.Sort((x, y) => DateTime.Compare(y.GiftSendDateUtc, x.GiftSendDateUtc));

            return results;
        }
    }
}
