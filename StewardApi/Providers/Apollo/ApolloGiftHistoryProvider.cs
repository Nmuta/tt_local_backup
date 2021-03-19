using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.Extensions.Configuration;
using Turn10.Data.Common;
using Turn10.Data.Kusto;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Apollo;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Legacy;
using Turn10.LiveOps.StewardApi.Providers.Data;

namespace Turn10.LiveOps.StewardApi.Providers.Apollo
{
    /// <inheritdoc />
    public sealed class ApolloGiftHistoryProvider : IApolloGiftHistoryProvider
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
        ///     Initializes a new instance of the <see cref="ApolloGiftHistoryProvider"/> class.
        /// </summary>
        /// <param name="kustoStreamingLogger">The Kusto streaming logger.</param>
        /// <param name="kustoProvider">The Kusto provider.</param>
        /// <param name="configuration">The configuration.</param>
        /// <param name="mapper">The mapper.</param>
        public ApolloGiftHistoryProvider(IKustoStreamingLogger kustoStreamingLogger, IKustoProvider kustoProvider, IConfiguration configuration, IMapper mapper)
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
        public async Task UpdateGiftHistoryAsync(string id, string title, string requestingAgent, GiftIdentityAntecedent giftHistoryAntecedent, ApolloGift gift)
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
        public async Task<IList<ApolloGiftHistory>> GetGiftHistoriesAsync(string id, string title, GiftIdentityAntecedent giftHistoryAntecedent)
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

        private async Task<IList<ApolloGiftHistory>> GetGiftHistoriesAsync(string playerId, string title)
        {
            playerId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(playerId));
            title.ShouldNotBeNullEmptyOrWhiteSpace(nameof(title));

            var giftHistoryResult = await this.kustoProvider.GetGiftHistoryAsync(playerId, title).ConfigureAwait(false);
            var results = new List<ApolloGiftHistory>();

            foreach (var history in giftHistoryResult)
            {
                ApolloGift convertedGift;
                // TODO: Remove these conversions once KUSTO is only using the new SunriseGift model
                // PlayerInventory model is from Scrutineer V1
                // SunrisePlayerInventory is from Scrutineer V2 & Steward V1
                // SunriseGift is the new model that uses a shared inventory model between all titles
                try
                {
                    convertedGift = history.GiftInventory.FromJson<ApolloGift>();
                    if (convertedGift.Inventory == null)
                    {
                        throw new UnknownFailureStewardException("Not an ApolloGift model");
                    }
                }
                catch
                {
                    try
                    {
                        var apolloPlayerInventory = history.GiftInventory.FromJson<ApolloPlayerInventory>();
                        convertedGift = this.mapper.Map<ApolloGift>(apolloPlayerInventory);
                        if (convertedGift.Inventory == null)
                        {
                            throw new UnknownFailureStewardException("Not an ApolloPlayerInventory model");
                        }
                    }
                    catch
                    {
                        var playerInventory = history.GiftInventory.FromJson<PlayerInventory>();
                        var apolloPlayerInventory = this.mapper.Map<ApolloPlayerInventory>(playerInventory);
                        convertedGift = this.mapper.Map<ApolloGift>(apolloPlayerInventory);
                    }
                }

                // The below logic is in place to separate out ID and it's antecedent. Once V1 Zendesk stops uploading
                // this will be removed and the playerId column in Kusto will be broken out into two columns.
                var splitId = history.PlayerId.Split(':');
                var antecedent = Enum.Parse<GiftIdentityAntecedent>(splitId[0]);
                var id = splitId[1];

                results.Add(new ApolloGiftHistory(antecedent, id, history.Title, history.RequestingAgent, history.GiftSendDateUtc, convertedGift));
            }

            results.Sort((x, y) => DateTime.Compare(y.GiftSendDateUtc, x.GiftSendDateUtc));

            return results;
        }
    }
}
