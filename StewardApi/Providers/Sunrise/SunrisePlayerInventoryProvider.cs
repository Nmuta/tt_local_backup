using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading.Tasks;
using AutoMapper;
using Forza.UserInventory.FH4.master.Generated;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Sunrise;

namespace Turn10.LiveOps.StewardApi.Providers.Sunrise
{
    /// <inheritdoc />
    public sealed class SunrisePlayerInventoryProvider : ISunrisePlayerInventoryProvider
    {
        private const string Title = "Sunrise";
        private const int MaxProfileResults = 50;
        private const int MaxCreditSendAmount = 500000000;
        private const int MaxWheelSpinAmount = 200;

        private readonly ISunriseUserInventoryService sunriseUserInventoryService;
        private readonly ISunriseGiftingService sunriseGiftingService;
        private readonly ISunriseUserService sunriseUserService;
        private readonly IMapper mapper;
        private readonly ISunriseGiftHistoryProvider giftHistoryProvider;

        /// <summary>
        ///     Initializes a new instance of the <see cref="SunrisePlayerInventoryProvider"/> class.
        /// </summary>
        /// <param name="sunriseUserInventoryService">The Sunrise inventory service.</param>
        /// <param name="sunriseGiftingService">The Sunrise gifting service.</param>
        /// <param name="sunriseUserService">The Sunrise user service.</param>
        /// <param name="mapper">The mapper.</param>
        /// <param name="giftHistoryProvider">The gift history provider.</param>
        public SunrisePlayerInventoryProvider(
                                              ISunriseUserInventoryService sunriseUserInventoryService,
                                              ISunriseGiftingService sunriseGiftingService,
                                              ISunriseUserService sunriseUserService,
                                              IMapper mapper,
                                              ISunriseGiftHistoryProvider giftHistoryProvider)
        {
            sunriseUserInventoryService.ShouldNotBeNull(nameof(sunriseUserInventoryService));
            sunriseGiftingService.ShouldNotBeNull(nameof(sunriseGiftingService));
            sunriseUserService.ShouldNotBeNull(nameof(sunriseUserService));
            mapper.ShouldNotBeNull(nameof(mapper));
            giftHistoryProvider.ShouldNotBeNull(nameof(giftHistoryProvider));

            this.sunriseUserInventoryService = sunriseUserInventoryService;
            this.sunriseGiftingService = sunriseGiftingService;
            this.sunriseUserService = sunriseUserService;
            this.mapper = mapper;
            this.giftHistoryProvider = giftHistoryProvider;
        }

        /// <inheritdoc />
        public async Task<SunrisePlayerInventory> GetPlayerInventoryAsync(ulong xuid)
        {
            xuid.ShouldNotBeNull(nameof(xuid));

            var response = await this.sunriseUserInventoryService.GetAdminUserInventoryAsync(xuid).ConfigureAwait(false);
            var playerInventoryDetails = this.mapper.Map<SunrisePlayerInventory>(response.summary);

            return playerInventoryDetails;
        }

        /// <inheritdoc />
        public async Task<IList<SunriseInventoryProfile>> GetInventoryProfilesAsync(ulong xuid)
        {
            xuid.ShouldNotBeNull(nameof(xuid));

            var response = await this.sunriseUserInventoryService.GetAdminUserProfilesAsync(xuid, MaxProfileResults).ConfigureAwait(false);

            return this.mapper.Map<IList<SunriseInventoryProfile>>(response.profiles);
        }

        /// <inheritdoc />
        public async Task<SunrisePlayerInventory> GetPlayerInventoryAsync(int profileId)
        {
            var response = await this.sunriseUserInventoryService.GetAdminUserInventoryByProfileIdAsync(profileId)
                .ConfigureAwait(false);
            var inventoryProfile = this.mapper.Map<SunrisePlayerInventory>(response.summary);

            return inventoryProfile;
        }

        /// <inheritdoc />
        public async Task<IList<SunriseLspGroup>> GetLspGroupsAsync(int startIndex, int maxResults)
        {
            var result = await this.sunriseUserService.GetUserGroupsAsync(startIndex, maxResults).ConfigureAwait(false);
            var lspGroups = this.mapper.Map<IList<SunriseLspGroup>>(result.userGroups);

            return lspGroups;
        }

        /// <inheritdoc />
        public async Task UpdatePlayerInventoryAsync(ulong xuid, SunrisePlayerInventory playerInventory, string requestingAgent)
        {
            playerInventory.ShouldNotBeNull(nameof(playerInventory));
            requestingAgent.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requestingAgent));

            playerInventory.WheelSpins = Math.Min(playerInventory.WheelSpins, MaxWheelSpinAmount);
            playerInventory.SuperWheelSpins = Math.Min(playerInventory.SuperWheelSpins, MaxWheelSpinAmount);

            var inventoryGifts = this.BuildInventoryItems(playerInventory);

            var currencyGifts = this.BuildCurrencyItems(playerInventory);

            async Task ServiceCall(InventoryItemType inventoryItemType, int itemId)
            {
                await this.sunriseGiftingService.AdminSendItemGiftAsync(xuid, inventoryItemType, itemId).ConfigureAwait(false);
            }

            await this.SendGifts(ServiceCall, inventoryGifts, currencyGifts).ConfigureAwait(false);

            await this.giftHistoryProvider.UpdateGiftHistoryAsync(xuid.ToString(CultureInfo.InvariantCulture), Title, requestingAgent, GiftHistoryAntecedent.Xuid, playerInventory).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task UpdatePlayerInventoriesAsync(IList<ulong> xuids, SunrisePlayerInventory playerInventory, string requestingAgent)
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
        public async Task UpdatePlayerInventoriesAsync(IList<string> gamertags, SunrisePlayerInventory playerInventory, string requestingAgent)
        {
            gamertags.ShouldNotBeNull(nameof(gamertags));
            playerInventory.ShouldNotBeNull(nameof(playerInventory));
            requestingAgent.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requestingAgent));

            var xuids = new List<ulong>();
            foreach (var gamertag in gamertags)
            {
                var result = await this.sunriseUserService.GetLiveOpsUserDataByGamerTagAsync(gamertag).ConfigureAwait(false);
                xuids.Add(result.userData.qwXuid);
            }

            await this.UpdatePlayerInventoriesAsync(xuids, playerInventory, requestingAgent).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task UpdateGroupInventoriesAsync(int groupId, SunrisePlayerInventory playerInventory, string requestingAgent)
        {
            playerInventory.ShouldNotBeNull(nameof(playerInventory));
            requestingAgent.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requestingAgent));
            groupId.ShouldBeGreaterThanValue(-1, nameof(groupId));

            playerInventory.WheelSpins = Math.Min(playerInventory.WheelSpins, MaxWheelSpinAmount);
            playerInventory.SuperWheelSpins = Math.Min(playerInventory.SuperWheelSpins, MaxWheelSpinAmount);

            var inventoryGifts = this.BuildInventoryItems(playerInventory);

            var currencyGifts = this.BuildCurrencyItems(playerInventory);

            async Task ServiceCall(InventoryItemType inventoryItemType, int itemId)
            {
                await this.sunriseGiftingService.AdminSendItemGroupGiftAsync(groupId, inventoryItemType, itemId).ConfigureAwait(false);
            }

            await this.SendGifts(ServiceCall, inventoryGifts, currencyGifts).ConfigureAwait(false);

            await this.giftHistoryProvider.UpdateGiftHistoryAsync(groupId.ToString(CultureInfo.InvariantCulture), Title, requestingAgent, GiftHistoryAntecedent.LspGroupId, playerInventory).ConfigureAwait(false);
        }

        private async Task SendGifts(Func<InventoryItemType, int, Task> serviceCall, IDictionary<InventoryItemType, IList<SunriseInventoryItem>> inventoryGifts, IDictionary<InventoryItemType, int> currencyGifts)
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
                var maxLimit = MaxCreditSendAmount;

                if (value <= 0)
                {
                    continue;
                }

                var playerCurrency = value;
                while (playerCurrency > 0)
                {
                    var creditsToSend = playerCurrency >= maxLimit ? maxLimit : playerCurrency;
                    await serviceCall(key, creditsToSend).ConfigureAwait(false);

                    playerCurrency -= creditsToSend;
                }
            }
        }

        private IDictionary<InventoryItemType, IList<SunriseInventoryItem>> BuildInventoryItems(SunrisePlayerInventory playerInventory)
        {
            return new Dictionary<InventoryItemType, IList<SunriseInventoryItem>>
            {
                { InventoryItemType.Car, this.EmptyIfNull(playerInventory.Cars).ConvertAll(car => (SunriseInventoryItem)car) },
                { InventoryItemType.CarHorns, this.EmptyIfNull(playerInventory.CarHorns) },
                { InventoryItemType.Emote, this.EmptyIfNull(playerInventory.Emotes) },
                { InventoryItemType.QuickChatLines, this.EmptyIfNull(playerInventory.QuickChatLines) },
                { InventoryItemType.VanityItem, this.EmptyIfNull(playerInventory.VanityItems) }
            };
        }

        private IDictionary<InventoryItemType, int> BuildCurrencyItems(SunrisePlayerInventory playerInventory)
        {
            return new Dictionary<InventoryItemType, int>
            {
                { InventoryItemType.Credits, playerInventory.Credits },
                { InventoryItemType.ForzathonPoints, playerInventory.ForzathonPoints },
                { InventoryItemType.SkillPoints, playerInventory.SkillPoints },
                { InventoryItemType.SuperWheelSpins, playerInventory.SuperWheelSpins },
                { InventoryItemType.WheelSpins, playerInventory.WheelSpins }
            };
        }

        private List<T> EmptyIfNull<T>(IList<T> inputList)
        {
            return (List<T>)inputList ?? new List<T>();
        }
    }
}
