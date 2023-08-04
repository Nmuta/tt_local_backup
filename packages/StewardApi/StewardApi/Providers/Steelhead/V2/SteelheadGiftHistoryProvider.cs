﻿using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.Data.Common;
using Turn10.Data.Kusto;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Providers.Data;

namespace Turn10.LiveOps.StewardApi.Providers.Steelhead.V2
{
    /// <inheritdoc />
    public sealed class SteelheadGiftHistoryProvider : ISteelheadGiftHistoryProvider
    {
        private static readonly IList<string> RequiredSettings = new List<string>
        {
            ConfigurationKeyConstants.KustoLoggerDatabase
        };

        private readonly IKustoStreamingLogger kustoStreamingLogger;
        private readonly IKustoProvider kustoProvider;
        private readonly string kustoDatabase;

        /// <summary>
        ///     Initializes a new instance of the <see cref="SteelheadGiftHistoryProvider"/> class.
        /// </summary>
        public SteelheadGiftHistoryProvider(
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
        public async Task UpdateGiftHistoryAsync(
            string id,
            string title,
            string requesterObjectId,
            GiftIdentityAntecedent giftHistoryAntecedent,
            SteelheadGift gift,
            string endpoint)
        {
            id.ShouldNotBeNullEmptyOrWhiteSpace(nameof(id));
            title.ShouldNotBeNullEmptyOrWhiteSpace(nameof(title));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));
            gift.ShouldNotBeNull(nameof(gift));
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            var playerId = $"{giftHistoryAntecedent}:{id}";
            var giftHistory = new GiftHistory(
                playerId,
                title,
                requesterObjectId,
                DateTime.UtcNow,
                gift.ToJson(),
                endpoint);
            var kustoColumnMappings = giftHistory.ToJsonColumnMappings();
            var tableName = typeof(GiftHistory).Name;
            var giftHistories = new List<GiftHistory> { giftHistory };

            await this.kustoStreamingLogger.IngestFromStreamAsync(
                giftHistories,
                this.kustoDatabase,
                tableName,
                kustoColumnMappings).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<IList<SteelheadGiftHistory>> GetGiftHistoriesAsync(
            string id,
            string title,
            GiftIdentityAntecedent giftHistoryAntecedent,
            string endpoint,
            DateTimeOffset? startDate,
            DateTimeOffset? endDate)
        {
            id.ShouldNotBeNullEmptyOrWhiteSpace(nameof(id));
            title.ShouldNotBeNullEmptyOrWhiteSpace(nameof(title));
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                var playerId = $"{giftHistoryAntecedent}:{id}";

                return await this.GetGiftHistoriesAsync(playerId, title, endpoint, startDate, endDate).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                if (ex is StewardBaseException)
                {
                    throw;
                }

                throw new NotFoundStewardException($"No history found for {giftHistoryAntecedent}: {id}.", ex);
            }
        }

        private async Task<IList<SteelheadGiftHistory>> GetGiftHistoriesAsync(
            string playerId,
            string title,
            string endpoint,
            DateTimeOffset? startDate,
            DateTimeOffset? endDate)
        {
            playerId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(playerId));
            title.ShouldNotBeNullEmptyOrWhiteSpace(nameof(title));
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            var giftHistoryResult = await this.kustoProvider.GetGiftHistoryAsync(playerId, title, endpoint, startDate, endDate)
                .ConfigureAwait(false);
            var results = new List<SteelheadGiftHistory>();

            foreach (var history in giftHistoryResult)
            {
                var convertedGift = history.GiftInventory.FromJson<SteelheadGift>();
                if (convertedGift.Inventory == null)
                {
                    throw new ConversionFailedStewardException($"Not a {nameof(SteelheadGift)} model");
                }

                // The below logic is in place to separate out ID and it's antecedent. Once V1 Zendesk stops uploading
                // this will be removed and the playerId column in Kusto will be broken out into two columns.
                var splitId = history.PlayerId.Split(':');
                var antecedent = Enum.Parse<GiftIdentityAntecedent>(splitId[0]);
                var id = splitId[1];

                results.Add(new SteelheadGiftHistory(
                    antecedent,
                    id,
                    history.Title,
                    history.RequesterObjectId,
                    history.GiftSendDateUtc,
                    convertedGift));
            }

            results.Sort((x, y) => DateTime.Compare(y.GiftSendDateUtc, x.GiftSendDateUtc));

            return results;
        }
    }
}
