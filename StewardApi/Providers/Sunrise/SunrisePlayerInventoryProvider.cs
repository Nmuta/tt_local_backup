using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Forza.UserInventory.FH4.master.Generated;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Legacy;
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
        public async Task<GiftResponse<ulong>> UpdatePlayerInventoryAsync(ulong xuid, SunriseGift gift, string requestingAgent)
        {
            gift.ShouldNotBeNull(nameof(gift));
            gift.Inventory.ShouldNotBeNull(nameof(gift.Inventory));
            requestingAgent.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requestingAgent));

            var giftResponse = new GiftResponse<ulong>();
            giftResponse.PlayerOrLspGroup = xuid;
            giftResponse.IdentityAntecedent = GiftHistoryAntecedent.Xuid;

            try
            {
                var inventoryGifts = this.BuildInventoryItems(gift.Inventory);
                var currencyGifts = this.BuildCurrencyItems(gift.Inventory);

                currencyGifts[InventoryItemType.WheelSpins] = Math.Min(currencyGifts[InventoryItemType.WheelSpins], MaxWheelSpinAmount);
                currencyGifts[InventoryItemType.SuperWheelSpins] = Math.Min(currencyGifts[InventoryItemType.SuperWheelSpins], MaxWheelSpinAmount);

                async Task ServiceCall(InventoryItemType inventoryItemType, int itemId)
                {
                    await this.sunriseGiftingService.AdminSendItemGiftAsync(xuid, inventoryItemType, itemId).ConfigureAwait(false);
                }

                await this.SendGifts(ServiceCall, inventoryGifts, currencyGifts).ConfigureAwait(false);

                await this.giftHistoryProvider.UpdateGiftHistoryAsync(xuid.ToString(CultureInfo.InvariantCulture), Title, requestingAgent, GiftHistoryAntecedent.Xuid, gift).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                giftResponse.Error = ex;
            }

            return giftResponse;
        }

        /// <inheritdoc />
        public async Task<IList<GiftResponse<ulong>>> UpdatePlayerInventoriesAsync(SunriseGroupGift groupGift, string requestingAgent)
        {
            groupGift.ShouldNotBeNull(nameof(groupGift));
            groupGift.Xuids.ShouldNotBeNull(nameof(groupGift.Xuids));
            groupGift.Inventory.ShouldNotBeNull(nameof(groupGift.Inventory));
            requestingAgent.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requestingAgent));

            var response = new List<GiftResponse<ulong>>();
            var gift = this.mapper.Map<SunriseGift>(groupGift);
            foreach (var xuid in groupGift.Xuids)
            {
                response.Add(await this.UpdatePlayerInventoryAsync(xuid, gift, requestingAgent).ConfigureAwait(false));
            }

            return response;
        }

        /// <inheritdoc/>
        public async Task<GiftResponse<int>> UpdateGroupInventoriesAsync(int groupId, SunriseGift gift, string requestingAgent)
        {
            groupId.ShouldBeGreaterThanValue(-1, nameof(groupId));
            gift.ShouldNotBeNull(nameof(gift));
            gift.Inventory.ShouldNotBeNull(nameof(gift.Inventory));
            requestingAgent.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requestingAgent));

            var giftResponse = new GiftResponse<int>();
            giftResponse.PlayerOrLspGroup = groupId;
            giftResponse.IdentityAntecedent = GiftHistoryAntecedent.LspGroupId;

            try
            {
                var inventoryGifts = this.BuildInventoryItems(gift.Inventory);
                var currencyGifts = this.BuildCurrencyItems(gift.Inventory);

                currencyGifts[InventoryItemType.WheelSpins] = Math.Min(currencyGifts[InventoryItemType.WheelSpins], MaxWheelSpinAmount);
                currencyGifts[InventoryItemType.SuperWheelSpins] = Math.Min(currencyGifts[InventoryItemType.SuperWheelSpins], MaxWheelSpinAmount);

                async Task ServiceCall(InventoryItemType inventoryItemType, int itemId)
                {
                    await this.sunriseGiftingService.AdminSendItemGroupGiftAsync(groupId, inventoryItemType, itemId).ConfigureAwait(false);
                }

                await this.SendGifts(ServiceCall, inventoryGifts, currencyGifts).ConfigureAwait(false);

                await this.giftHistoryProvider.UpdateGiftHistoryAsync(groupId.ToString(CultureInfo.InvariantCulture), Title, requestingAgent, GiftHistoryAntecedent.LspGroupId, gift).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                giftResponse.Error = ex;
            }

            return giftResponse;
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

        private IDictionary<InventoryItemType, IList<MasterInventoryItem>> BuildInventoryItems(SunriseMasterInventory giftInventory)
        {
            return new Dictionary<InventoryItemType, IList<MasterInventoryItem>>
            {
                { InventoryItemType.Car, this.EmptyIfNull(giftInventory.Cars) },
                { InventoryItemType.CarHorns, this.EmptyIfNull(giftInventory.CarHorns) },
                { InventoryItemType.Emote, this.EmptyIfNull(giftInventory.Emotes) },
                { InventoryItemType.QuickChatLines, this.EmptyIfNull(giftInventory.QuickChatLines) },
                { InventoryItemType.VanityItem, this.EmptyIfNull(giftInventory.VanityItems) }
            };
        }

        private IDictionary<InventoryItemType, int> BuildCurrencyItems(SunriseMasterInventory giftInventory)
        {
            var credits = giftInventory.CreditRewards.FirstOrDefault(data => { return data.Description == "Credits"; });
            var forzathonPoints = giftInventory.CreditRewards.FirstOrDefault(data => { return data.Description == "ForzathonPoints"; });
            var skillPoints = giftInventory.CreditRewards.FirstOrDefault(data => { return data.Description == "SkillPoints"; });
            var wheelSpins = giftInventory.CreditRewards.FirstOrDefault(data => { return data.Description == "WheelSpins"; });
            var superWheelSpins = giftInventory.CreditRewards.FirstOrDefault(data => { return data.Description == "SuperWheelSpins"; });

            return new Dictionary<InventoryItemType, int>
            {
                { InventoryItemType.Credits, credits != default(MasterInventoryItem) ? credits.Quantity : 0 },
                { InventoryItemType.ForzathonPoints, forzathonPoints != default(MasterInventoryItem) ? forzathonPoints.Quantity : 0 },
                { InventoryItemType.SkillPoints, skillPoints != default(MasterInventoryItem) ? skillPoints.Quantity : 0 },
                { InventoryItemType.WheelSpins, wheelSpins != default(MasterInventoryItem) ? wheelSpins.Quantity : 0 },
                { InventoryItemType.SuperWheelSpins, superWheelSpins != default(MasterInventoryItem) ? superWheelSpins.Quantity : 0 },
            };
        }

        private List<T> EmptyIfNull<T>(IList<T> inputList)
        {
            return (List<T>)inputList ?? new List<T>();
        }
    }
}
