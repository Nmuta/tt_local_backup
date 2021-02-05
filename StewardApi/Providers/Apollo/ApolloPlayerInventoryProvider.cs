using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
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

            var response = await this.apolloUserInventoryService.GetAdminUserInventoryAsync(xuid).ConfigureAwait(false);

            return this.mapper.Map<ApolloPlayerInventory>(response.summary);
        }

        /// <inheritdoc/>
        public async Task<IList<ApolloInventoryProfile>> GetInventoryProfilesAsync(ulong xuid)
        {
            xuid.ShouldNotBeNull(nameof(xuid));

            var response = await this.apolloUserInventoryService.GetAdminUserProfilesAsync(xuid, MaxProfileResults).ConfigureAwait(false);

            return this.mapper.Map<IList<ApolloInventoryProfile>>(response.profiles);
        }

        /// <inheritdoc/>
        public async Task<ApolloPlayerInventory> GetPlayerInventoryAsync(int profileId)
        {
            var response = await this.apolloUserInventoryService.GetAdminUserInventoryByProfileIdAsync(profileId).ConfigureAwait(false);

            return this.mapper.Map<ApolloPlayerInventory>(response.summary);
        }

        /// <inheritdoc />
        public async Task UpdatePlayerInventoryAsync(ulong xuid, ApolloGift gift, string requestingAgent)
        {
            gift.ShouldNotBeNull(nameof(gift));
            gift.Inventory.ShouldNotBeNull(nameof(gift.Inventory));
            requestingAgent.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requestingAgent));

            var inventoryGifts = this.BuildInventoryItems(gift.Inventory);
            var currencyGifts = this.BuildCurrencyItems(gift.Inventory);

            async Task ServiceCall(InventoryItemType inventoryItemType, int itemId)
            {
                await this.apolloGiftingService.AdminSendItemGiftAsync(xuid, inventoryItemType, itemId).ConfigureAwait(false);
            }

            await this.SendGifts(ServiceCall, inventoryGifts, currencyGifts).ConfigureAwait(false);

            await this.giftHistoryProvider.UpdateGiftHistoryAsync(xuid.ToString(CultureInfo.InvariantCulture), TitleConstants.ApolloCodeName, requestingAgent, GiftHistoryAntecedent.Xuid, gift).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task UpdatePlayerInventoriesAsync(ApolloGroupGift groupGift, string requestingAgent)
        {
            groupGift.ShouldNotBeNull(nameof(groupGift));
            groupGift.Xuids.ShouldNotBeNull(nameof(groupGift.Xuids));
            groupGift.Inventory.ShouldNotBeNull(nameof(groupGift.Inventory));
            requestingAgent.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requestingAgent));

            var gift = this.mapper.Map<ApolloGift>(groupGift);
            foreach (var xuid in groupGift.Xuids)
            {
                await this.UpdatePlayerInventoryAsync(xuid, gift, requestingAgent).ConfigureAwait(false);
            }
        }

        /// <inheritdoc/>
        public async Task UpdateGroupInventoriesAsync(int groupId, ApolloGift gift, string requestingAgent)
        {
            gift.ShouldNotBeNull(nameof(gift));
            gift.Inventory.ShouldNotBeNull(nameof(gift.Inventory));
            requestingAgent.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requestingAgent));
            groupId.ShouldBeGreaterThanValue(-1, nameof(groupId));

            var inventoryGifts = this.BuildInventoryItems(gift.Inventory);
            var currencyGifts = this.BuildCurrencyItems(gift.Inventory);

            async Task ServiceCall(InventoryItemType inventoryItemType, int itemId)
            {
                await this.apolloGiftingService.AdminSendItemGroupGiftAsync(groupId, inventoryItemType, itemId).ConfigureAwait(false);
            }

            await this.SendGifts(ServiceCall, inventoryGifts, currencyGifts).ConfigureAwait(false);

            await this.giftHistoryProvider.UpdateGiftHistoryAsync(groupId.ToString(CultureInfo.InvariantCulture), TitleConstants.ApolloCodeName, requestingAgent, GiftHistoryAntecedent.LspGroupId, gift).ConfigureAwait(false);
        }

        private async Task SendGifts(Func<InventoryItemType, int, Task> serviceCall, IDictionary<InventoryItemType, IList<MasterInventoryItem>> inventoryGifts, IDictionary<InventoryItemType, int> currencyGifts)
        {
            foreach (var (key, value) in inventoryGifts)
            {
                foreach (var item in value)
                {
                    for (var i = 0; i < item.Quantity; i++)
                    {
                        await serviceCall(key, item.Id).ConfigureAwait(false);
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

        private IDictionary<InventoryItemType, IList<MasterInventoryItem>> BuildInventoryItems(ApolloMasterInventory giftInventory)
        {
            return new Dictionary<InventoryItemType, IList<MasterInventoryItem>>
            {
                { InventoryItemType.Car, this.EmptyIfNull(giftInventory.Cars) },
                { InventoryItemType.VanityItem, this.EmptyIfNull(giftInventory.VanityItems) }
            };
        }

        private IDictionary<InventoryItemType, int> BuildCurrencyItems(ApolloMasterInventory giftInventory)
        {
            var credits = giftInventory.CreditRewards.FirstOrDefault(data => { return data.Description == "Credits"; });

            return new Dictionary<InventoryItemType, int>
            {
                { InventoryItemType.Credits, credits != default(MasterInventoryItem) ? credits.Quantity : 0 },
            };
        }

        private List<T> EmptyIfNull<T>(IList<T> inputList)
        {
            return (List<T>)inputList ?? new List<T>();
        }
    }
}
