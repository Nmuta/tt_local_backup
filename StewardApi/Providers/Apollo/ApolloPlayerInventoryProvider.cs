using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading.Tasks;
using AutoMapper;
using Forza.UserInventory.FM7.Generated;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Apollo;

namespace Turn10.LiveOps.StewardApi.Providers.Apollo
{
    /// <inheritdoc/>
    public sealed class ApolloPlayerInventoryProvider : IApolloPlayerInventoryProvider
    {
        private const int MaxProfileResults = 50;
        private const int MaxCreditSendAmount = 500000000;

        private readonly IApolloUserInventoryService apolloUserInventoryService;
        private readonly IApolloGiftingService apolloGiftingService;
        private readonly IApolloUserService apolloUserService;
        private readonly IApolloGiftHistoryProvider giftHistoryProvider;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="ApolloPlayerInventoryProvider"/> class.
        /// </summary>
        /// <param name="apolloUserInventoryService">The Apollo user inventory service.</param>
        /// <param name="apolloGiftingService">The Apollo gifting service.</param>
        /// <param name="apolloUserService">The Apollo user service.</param>
        /// <param name="giftHistoryProvider">The gift history provider.</param>
        /// <param name="mapper">The mapper.</param>
        public ApolloPlayerInventoryProvider(
                                             IApolloUserInventoryService apolloUserInventoryService,
                                             IApolloGiftingService apolloGiftingService,
                                             IApolloUserService apolloUserService,
                                             IApolloGiftHistoryProvider giftHistoryProvider,
                                             IMapper mapper)
        {
            apolloUserInventoryService.ShouldNotBeNull(nameof(apolloUserInventoryService));
            apolloGiftingService.ShouldNotBeNull(nameof(apolloGiftingService));
            apolloUserService.ShouldNotBeNull(nameof(apolloUserService));
            giftHistoryProvider.ShouldNotBeNull(nameof(giftHistoryProvider));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.apolloUserInventoryService = apolloUserInventoryService;
            this.apolloGiftingService = apolloGiftingService;
            this.apolloUserService = apolloUserService;
            this.giftHistoryProvider = giftHistoryProvider;
            this.mapper = mapper;
        }

        /// <inheritdoc/>
        public async Task<ApolloPlayerInventory> GetPlayerInventoryAsync(ulong xuid)
        {
            xuid.ShouldNotBeNull(nameof(xuid));

            try
            {
                var response = await this.apolloUserInventoryService.GetAdminUserInventoryAsync(xuid).ConfigureAwait(false);

                return this.mapper.Map<ApolloPlayerInventory>(response.summary);
            }
            catch (ForzaClientException ex)
            {
                if (ex.ResultCode == LspResponse.Error && ex.ErrorCode == LspResponse.PlayerNotFound)
                {
                    return null;
                }

                throw;
            }
        }

        /// <inheritdoc/>
        public async Task<IList<ApolloInventoryProfile>> GetInventoryProfilesAsync(ulong xuid)
        {
            xuid.ShouldNotBeNull(nameof(xuid));

            try
            {
                var response = await this.apolloUserInventoryService.GetAdminUserProfilesAsync(xuid, MaxProfileResults).ConfigureAwait(false);

                return this.mapper.Map<IList<ApolloInventoryProfile>>(response.profiles);
            }
            catch (ForzaClientException ex)
            {
                if (ex.ResultCode == LspResponse.Error && ex.ErrorCode == LspResponse.PlayerNotFound)
                {
                    return null;
                }

                throw;
            }
        }

        /// <inheritdoc/>
        public async Task<ApolloPlayerInventory> GetPlayerInventoryAsync(int profileId)
        {
            try
            {
                var response = await this.apolloUserInventoryService.GetAdminUserInventoryByProfileIdAsync(profileId).ConfigureAwait(false);

                return this.mapper.Map<ApolloPlayerInventory>(response.summary);
            }
            catch (ForzaClientException ex)
            {
                if (ex.ResultCode == LspResponse.Error && ex.ErrorCode == LspResponse.PlayerNotFound)
                {
                    return null;
                }

                throw;
            }
        }

        /// <inheritdoc />
        public async Task UpdatePlayerInventoryAsync(ulong xuid, ApolloPlayerInventory playerInventory, string requestingAgent)
        {
            playerInventory.ShouldNotBeNull(nameof(playerInventory));
            requestingAgent.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requestingAgent));

            var inventoryGifts = this.BuildInventoryItems(playerInventory);

            var currencyGifts = this.BuildCurrencyItems(playerInventory);

            async Task ServiceCall(InventoryItemType inventoryItemType, int itemId)
            {
                await this.apolloGiftingService.AdminSendItemGiftAsync(xuid, inventoryItemType, itemId).ConfigureAwait(false);
            }

            await this.SendGifts(ServiceCall, inventoryGifts, currencyGifts).ConfigureAwait(false);

            await this.giftHistoryProvider.UpdateGiftHistoryAsync(xuid.ToString(CultureInfo.InvariantCulture), TitleConstants.ApolloCodeName, requestingAgent, GiftHistoryAntecedent.Xuid, playerInventory).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task UpdatePlayerInventoriesAsync(IList<ulong> xuids, ApolloPlayerInventory playerInventory, string requestingAgent)
        {
            xuids.ShouldNotBeNull(nameof(xuids));
            playerInventory.ShouldNotBeNull(nameof(playerInventory));
            requestingAgent.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requestingAgent));

            foreach (var xuid in xuids)
            {
                await this.UpdatePlayerInventoryAsync(xuid, playerInventory, requestingAgent).ConfigureAwait(false);
            }
        }

        /// <inheritdoc />
        public async Task UpdatePlayerInventoriesAsync(IList<string> gamertags, ApolloPlayerInventory playerInventory, string requestingAgent)
        {
            gamertags.ShouldNotBeNull(nameof(gamertags));
            playerInventory.ShouldNotBeNull(nameof(playerInventory));
            requestingAgent.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requestingAgent));

            var xuids = new List<ulong>();
            foreach (var gamertag in gamertags)
            {
                var result = await this.apolloUserService.LiveOpsGetUserDataByGamertagAsync(gamertag).ConfigureAwait(false);
                xuids.Add(result.returnData.qwXuid);
            }

            await this.UpdatePlayerInventoriesAsync(xuids, playerInventory, requestingAgent).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task UpdateGroupInventoriesAsync(int groupId, ApolloPlayerInventory playerInventory, string requestingAgent)
        {
            playerInventory.ShouldNotBeNull(nameof(playerInventory));
            requestingAgent.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requestingAgent));
            groupId.ShouldBeGreaterThanValue(-1, nameof(groupId));

            var inventoryGifts = this.BuildInventoryItems(playerInventory);

            var currencyGifts = this.BuildCurrencyItems(playerInventory);

            async Task ServiceCall(InventoryItemType inventoryItemType, int itemId)
            {
                await this.apolloGiftingService.AdminSendItemGroupGiftAsync(groupId, inventoryItemType, itemId).ConfigureAwait(false);
            }

            await this.SendGifts(ServiceCall, inventoryGifts, currencyGifts).ConfigureAwait(false);

            await this.giftHistoryProvider.UpdateGiftHistoryAsync(groupId.ToString(CultureInfo.InvariantCulture), TitleConstants.ApolloCodeName, requestingAgent, GiftHistoryAntecedent.LspGroupId, playerInventory).ConfigureAwait(false);
        }

        private async Task SendGifts(Func<InventoryItemType, int, Task> serviceCall, IDictionary<InventoryItemType, IList<ApolloInventoryItem>> inventoryGifts, IDictionary<InventoryItemType, int> currencyGifts)
        {
            foreach (var (key, value) in inventoryGifts)
            {
                foreach (var item in value)
                {
                    for (var i = 0; i < item.Quantity; i++)
                    {
                        await serviceCall(key, item.ItemId).ConfigureAwait(false);
                    }
                }
            }

            foreach (var (key, value) in currencyGifts)
            {
                if (value <= 0)
                {
                    continue;
                }

                var playerCurrency = value;
                while (playerCurrency > 0)
                {
                    var creditsToSend = playerCurrency >= MaxCreditSendAmount ? MaxCreditSendAmount : playerCurrency;
                    await serviceCall(key, creditsToSend).ConfigureAwait(false);

                    playerCurrency -= creditsToSend;
                }
            }
        }

        private IDictionary<InventoryItemType, IList<ApolloInventoryItem>> BuildInventoryItems(ApolloPlayerInventory playerInventory)
        {
            return new Dictionary<InventoryItemType, IList<ApolloInventoryItem>>
            {
                { InventoryItemType.Car, this.EmptyIfNull(playerInventory.Cars).ConvertAll(car => (ApolloInventoryItem)car) },
                { InventoryItemType.VanityItem, this.EmptyIfNull(playerInventory.VanityItems) }
            };
        }

        private IDictionary<InventoryItemType, int> BuildCurrencyItems(ApolloPlayerInventory playerInventory)
        {
            return new Dictionary<InventoryItemType, int>
            {
                { InventoryItemType.Credits, playerInventory.Credits }
            };
        }

        private List<T> EmptyIfNull<T>(IList<T> inputList)
        {
            return (List<T>)inputList ?? new List<T>();
        }
    }
}
