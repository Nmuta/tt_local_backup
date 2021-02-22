﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.Extensions.Configuration;
using Turn10.Data.Common;
using Turn10.Data.Kusto;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Legacy;
using Turn10.LiveOps.StewardApi.Contracts.Sunrise;

namespace Turn10.LiveOps.StewardApi.Providers.Sunrise
{
    /// <inheritdoc />
    public sealed class SunriseGiftHistoryProvider : ISunriseGiftHistoryProvider
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
        ///     Initializes a new instance of the <see cref="SunriseGiftHistoryProvider"/> class.
        /// </summary>
        /// <param name="kustoStreamingLogger">The Kusto streaming logger.</param>
        /// <param name="kustoProvider">The Kusto provider.</param>
        /// <param name="configuration">The configuration.</param>
        /// <param name="mapper">The mapper.</param>
        public SunriseGiftHistoryProvider(IKustoStreamingLogger kustoStreamingLogger, IKustoProvider kustoProvider, IConfiguration configuration, IMapper mapper)
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
        public async Task UpdateGiftHistoryAsync(string id, string title, string requestingAgent, GiftHistoryAntecedent giftHistoryAntecedent, SunriseGift gift)
        {
            id.ShouldNotBeNullEmptyOrWhiteSpace(nameof(id));
            title.ShouldNotBeNullEmptyOrWhiteSpace(nameof(title));
            requestingAgent.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requestingAgent));
            gift.ShouldNotBeNull(nameof(gift));

            var playerId = $"{giftHistoryAntecedent}:{id}";
            var giftHistory = new GiftHistory(playerId, title, requestingAgent, DateTime.UtcNow, gift.ToJson());
            var kustoColumnMappings = giftHistory.ToJsonColumnMappings();
            var tableName = typeof(GiftHistory).Name;
            var giftHistories = new List<GiftHistory> { giftHistory };

            await this.kustoStreamingLogger.IngestFromStreamAsync(giftHistories, this.kustoDatabase, tableName, kustoColumnMappings).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<IList<SunriseGiftHistory>> GetGiftHistoriesAsync(string id, string title, GiftHistoryAntecedent giftHistoryAntecedent)
        {
            id.ShouldNotBeNullEmptyOrWhiteSpace(nameof(id));
            title.ShouldNotBeNullEmptyOrWhiteSpace(nameof(title));

            try
            {
                var playerId = $"{giftHistoryAntecedent}:{id}";

                return await this.GetGiftHistoriesAsync(playerId, title).ConfigureAwait(false);
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

        private async Task<IList<SunriseGiftHistory>> GetGiftHistoriesAsync(string playerId, string title)
        {
            playerId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(playerId));
            title.ShouldNotBeNullEmptyOrWhiteSpace(nameof(title));

            var giftHistoryResult = await this.kustoProvider.GetGiftHistoryAsync(playerId, title).ConfigureAwait(false);
            var results = new List<SunriseGiftHistory>();

            foreach (var history in giftHistoryResult)
            {
                SunriseGift convertedGift;
                // TODO: Remove these conversions once KUSTO is only using the new SunriseGift model
                // PlayerInventory model is from Scrutineer V1
                // SunrisePlayerInventory is from Scrutineer V2 & Steward V1
                // SunriseGift is the new model that uses a shared inventory model between all titles
                try
                {
                    convertedGift = history.GiftInventory.FromJson<SunriseGift>();
                    if (convertedGift.Inventory == null)
                    {
                        throw new UnknownFailureStewardException("Not a SunriseGift model");
                    }
                }
                catch
                {
                    try
                    {
                        var sunrisePlayerInventory = history.GiftInventory.FromJson<SunrisePlayerInventory>();
                        convertedGift = this.mapper.Map<SunriseGift>(sunrisePlayerInventory);
                        if (convertedGift.Inventory == null)
                        {
                            throw new UnknownFailureStewardException("Not a SunrisePlayerInventory model");
                        }
                    }
                    catch
                    {
                        var playerInventory = history.GiftInventory.FromJson<PlayerInventory>();
                        var sunrisePlayerInventory = this.mapper.Map<SunrisePlayerInventory>(playerInventory);
                        convertedGift = this.mapper.Map<SunriseGift>(sunrisePlayerInventory);
                    }
                }

                // The below logic is in place to separate out ID and it's antecedent. Once V1 Zendesk stops uploading
                // this will be removed and the playerId column in Kusto will be broken out into two columns.
                var splitId = history.PlayerId.Split(':');
                var antecedent = Enum.Parse<GiftHistoryAntecedent>(splitId[0]);
                var id = splitId[1];

                results.Add(new SunriseGiftHistory(antecedent, id, history.Title, history.RequestingAgent, history.GiftSendDateUtc, convertedGift));
            }

            results.Sort((x, y) => DateTime.Compare(y.GiftSendDateUtc, x.GiftSendDateUtc));

            return results;
        }
    }
}
