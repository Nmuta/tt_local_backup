﻿using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Forza.UserInventory.FH4.Generated;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Errors;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Sunrise;
using Turn10.LiveOps.StewardApi.Providers.Sunrise.ServiceConnections;

namespace Turn10.LiveOps.StewardApi.Providers.Sunrise
{
    /// <inheritdoc />
    public sealed class SunrisePlayerInventoryProvider : ISunrisePlayerInventoryProvider
    {
        private const int MaxProfileResults = 50;
        private const int AgentCreditSendAmount = 500_000_000;
        private const int AdminCreditSendAmount = 999_999_999;
        private const int MaxWheelSpinAmount = 200;

        private readonly ISunriseService sunriseService;
        private readonly IMapper mapper;
        private readonly IRefreshableCacheStore refreshableCacheStore;
        private readonly ISunriseGiftHistoryProvider giftHistoryProvider;

        /// <summary>
        ///     Initializes a new instance of the <see cref="SunrisePlayerInventoryProvider"/> class.
        /// </summary>
        public SunrisePlayerInventoryProvider(
            ISunriseService sunriseService,
            IMapper mapper,
            IRefreshableCacheStore refreshableCacheStore,
            ISunriseGiftHistoryProvider giftHistoryProvider)
        {
            sunriseService.ShouldNotBeNull(nameof(sunriseService));
            mapper.ShouldNotBeNull(nameof(mapper));
            refreshableCacheStore.ShouldNotBeNull(nameof(refreshableCacheStore));
            giftHistoryProvider.ShouldNotBeNull(nameof(giftHistoryProvider));

            this.sunriseService = sunriseService;
            this.mapper = mapper;
            this.refreshableCacheStore = refreshableCacheStore;
            this.giftHistoryProvider = giftHistoryProvider;
        }

        /// <inheritdoc />
        public async Task<SunrisePlayerInventory> GetPlayerInventoryAsync(ulong xuid, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                var result = await this.sunriseService.GetAdminUserInventoryAsync(xuid, endpoint)
                    .ConfigureAwait(false);

                var playerInventoryDetails = this.mapper.Map<SunrisePlayerInventory>(result.summary);

                return playerInventoryDetails;
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No player found for XUID: {xuid}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<SunrisePlayerInventory> GetPlayerInventoryAsync(int profileId, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                var response = await this.sunriseService.GetAdminUserInventoryByProfileIdAsync(profileId, endpoint)
                    .ConfigureAwait(false);
                var inventoryProfile = this.mapper.Map<SunrisePlayerInventory>(response.summary);

                return inventoryProfile;
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No inventory found for Profile ID: {profileId}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IList<SunriseInventoryProfile>> GetInventoryProfilesAsync(ulong xuid, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                var response = await this.sunriseService.GetAdminUserProfilesAsync(xuid, MaxProfileResults, endpoint)
                    .ConfigureAwait(false);

                return this.mapper.Map<IList<SunriseInventoryProfile>>(response.profiles);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No inventory profiles found for XUID: {xuid}", ex);
            }
        }

        /// <inheritdoc />
        public async Task<SunriseAccountInventory> GetAccountInventoryAsync(ulong xuid, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                var response = await this.sunriseService.GetTokenBalanceAsync(xuid, endpoint).ConfigureAwait(false);

                return this.mapper.Map<SunriseAccountInventory>(response.transactions);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No account found for XUID: {xuid}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<GiftResponse<ulong>> UpdatePlayerInventoryAsync(ulong xuid, SunriseGift gift, string requesterObjectId, bool useAdminCreditLimit, string endpoint)
        {
            gift.ShouldNotBeNull(nameof(gift));
            gift.Inventory.ShouldNotBeNull(nameof(gift.Inventory));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            var giftResponse = new GiftResponse<ulong>
            {
                PlayerOrLspGroup = xuid, IdentityAntecedent = GiftIdentityAntecedent.Xuid
            };

            try
            {
                var inventoryGifts = this.BuildInventoryItems(gift.Inventory);
                var currencyGifts = this.BuildCurrencyItems(gift.Inventory);
                var backstagePasses = gift.Inventory.CreditRewards
                    .FirstOrDefault(data => data.Description == "BackstagePasses");
                var backstagePassDelta = backstagePasses?.Quantity ?? 0;

                var creditSendLimit = useAdminCreditLimit ? AdminCreditSendAmount : AgentCreditSendAmount;
                currencyGifts[InventoryItemType.Credits] =
                    Math.Min(currencyGifts[InventoryItemType.Credits], creditSendLimit);
                currencyGifts[InventoryItemType.WheelSpins] =
                    Math.Min(currencyGifts[InventoryItemType.WheelSpins], MaxWheelSpinAmount);
                currencyGifts[InventoryItemType.SuperWheelSpins] =
                Math.Min(currencyGifts[InventoryItemType.SuperWheelSpins], MaxWheelSpinAmount);

                async Task ServiceCall(InventoryItemType inventoryItemType, int itemId)
                {
                    await this.sunriseService.AdminSendItemGiftAsync(xuid, inventoryItemType, itemId, endpoint)
                        .ConfigureAwait(false);
                }

                await SendGifts(ServiceCall, inventoryGifts, currencyGifts).ConfigureAwait(false);
                await this.UpdateBackstagePasses(xuid, backstagePassDelta, endpoint).ConfigureAwait(false);

                await this.giftHistoryProvider.UpdateGiftHistoryAsync(
                    xuid.ToString(CultureInfo.InvariantCulture),
                    TitleConstants.SunriseCodeName,
                    requesterObjectId,
                    GiftIdentityAntecedent.Xuid,
                    gift,
                    endpoint).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                giftResponse.Error = new FailedToSendStewardError($"Failed to send gift to XUID: {xuid}.", ex);
            }

            return giftResponse;
        }

        /// <inheritdoc />
        public async Task<IList<GiftResponse<ulong>>> UpdatePlayerInventoriesAsync(
            SunriseGroupGift groupGift,
            string requesterObjectId,
            bool useAdminCreditLimit,
            string endpoint)
        {
            groupGift.ShouldNotBeNull(nameof(groupGift));
            groupGift.Xuids.ShouldNotBeNull(nameof(groupGift.Xuids));
            groupGift.Inventory.ShouldNotBeNull(nameof(groupGift.Inventory));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            var response = new List<GiftResponse<ulong>>();
            var gift = this.mapper.Map<SunriseGift>(groupGift);
            foreach (var xuid in groupGift.Xuids)
            {
                response.Add(await this.UpdatePlayerInventoryAsync(
                    xuid,
                    gift,
                    requesterObjectId,
                    useAdminCreditLimit,
                    endpoint).ConfigureAwait(false));
            }

            return response;
        }

        /// <inheritdoc/>
        public async Task<GiftResponse<int>> UpdateGroupInventoriesAsync(
            int groupId,
            SunriseGift gift,
            string requesterObjectId,
            bool useAdminCreditLimit,
            string endpoint)
        {
            groupId.ShouldBeGreaterThanValue(-1, nameof(groupId));
            gift.ShouldNotBeNull(nameof(gift));
            gift.Inventory.ShouldNotBeNull(nameof(gift.Inventory));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            var giftResponse = new GiftResponse<int>
            {
                PlayerOrLspGroup = groupId, IdentityAntecedent = GiftIdentityAntecedent.LspGroupId
            };

            try
            {
                var inventoryGifts = this.BuildInventoryItems(gift.Inventory);
                var currencyGifts = this.BuildCurrencyItems(gift.Inventory);

                var creditSendLimit = useAdminCreditLimit ? AdminCreditSendAmount : AgentCreditSendAmount;
                currencyGifts[InventoryItemType.Credits] =
                    Math.Min(currencyGifts[InventoryItemType.Credits], creditSendLimit);
                currencyGifts[InventoryItemType.WheelSpins] =
                    Math.Min(currencyGifts[InventoryItemType.WheelSpins], MaxWheelSpinAmount);
                currencyGifts[InventoryItemType.SuperWheelSpins] =
                    Math.Min(currencyGifts[InventoryItemType.SuperWheelSpins], MaxWheelSpinAmount);

                async Task ServiceCall(InventoryItemType inventoryItemType, int itemId)
                {
                    await this.sunriseService.AdminSendItemGroupGiftAsync(
                        groupId,
                        inventoryItemType,
                        itemId,
                        endpoint).ConfigureAwait(false);
                }

                await SendGifts(ServiceCall, inventoryGifts, currencyGifts).ConfigureAwait(false);

                await this.giftHistoryProvider.UpdateGiftHistoryAsync(
                    groupId.ToString(CultureInfo.InvariantCulture),
                    TitleConstants.SunriseCodeName,
                    requesterObjectId,
                    GiftIdentityAntecedent.LspGroupId,
                    gift,
                    endpoint).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                giftResponse.Error = new FailedToSendStewardError(
                    $"Failed to send gift to group ID: {groupId}.",
                    ex);
            }

            return giftResponse;
        }

        private static async Task SendGifts(
            Func<InventoryItemType, int, Task> serviceCall,
            IDictionary<InventoryItemType, IList<MasterInventoryItem>> inventoryGifts,
            IDictionary<InventoryItemType, int> currencyGifts)
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

                var batchLimit = AgentCreditSendAmount;
                var playerCurrency = value;

                while (playerCurrency > 0)
                {
                    var creditsToSend = playerCurrency >= batchLimit ? batchLimit : playerCurrency;
                    await serviceCall(key, creditsToSend).ConfigureAwait(false);

                    playerCurrency -= creditsToSend;
                }
            }
        }

        private async Task UpdateBackstagePasses(ulong xuid, int balanceDelta, string endpoint)
        {
            if (balanceDelta <= 0)
            {
                return;
            }

            var status = await this.sunriseService.GetTokenBalanceAsync(xuid, endpoint).ConfigureAwait(false);
            var currentBalance = status.transactions.OfflineBalance;
            var newBalance = (uint)Math.Max(0, currentBalance + balanceDelta);

            await this.sunriseService.SetTokenBalanceAsync(xuid, newBalance, endpoint).ConfigureAwait(false);

            this.refreshableCacheStore.ClearItem(SunriseCacheKey.MakeBackstagePassKey(endpoint, xuid));
        }

        private IDictionary<InventoryItemType, IList<MasterInventoryItem>> BuildInventoryItems(
            SunriseMasterInventory giftInventory)
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
            var credits = giftInventory.CreditRewards.FirstOrDefault(
                data => data.Description == "Credits");
            var forzathonPoints = giftInventory.CreditRewards.FirstOrDefault(
                data => data.Description == "ForzathonPoints");
            var skillPoints = giftInventory.CreditRewards.FirstOrDefault(
                data => data.Description == "SkillPoints");
            var wheelSpins = giftInventory.CreditRewards.FirstOrDefault(
                data => data.Description == "WheelSpins");
            var superWheelSpins = giftInventory.CreditRewards.FirstOrDefault(
                data => data.Description == "SuperWheelSpins");

            return new Dictionary<InventoryItemType, int>
            {
                {
                    InventoryItemType.Credits, credits?.Quantity ?? 0
                },
                {
                    InventoryItemType.ForzathonPoints, forzathonPoints?.Quantity ?? 0
                },
                {
                    InventoryItemType.SkillPoints, skillPoints?.Quantity ?? 0
                },
                {
                    InventoryItemType.WheelSpins, wheelSpins?.Quantity ?? 0
                },
                {
                    InventoryItemType.SuperWheelSpins, superWheelSpins?.Quantity ?? 0
                },
            };
        }

        private List<T> EmptyIfNull<T>(IList<T> inputList)
        {
            return (List<T>)inputList ?? new List<T>();
        }
    }
}
