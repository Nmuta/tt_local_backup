﻿using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Forza.Notifications.FH5_main.Generated;
using Forza.UserInventory.FH5_main.Generated;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Errors;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Woodstock.ServiceConnections;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Woodstock;

namespace Turn10.LiveOps.StewardApi.Providers.Woodstock
{
    /// <inheritdoc />
    public sealed class WoodstockPlayerInventoryProvider : IWoodstockPlayerInventoryProvider
    {
        private const int MaxProfileResults = 50;
        private const int AgentCreditSendAmount = 500_000_000;
        private const int AdminCreditSendAmount = 999_999_999;
        private const int MaxWheelSpinAmount = 200;

        private readonly IWoodstockService woodstockService;
        private readonly IMapper mapper;
        private readonly IRefreshableCacheStore refreshableCacheStore;
        private readonly IWoodstockGiftHistoryProvider giftHistoryProvider;
        private readonly INotificationHistoryProvider notificationHistoryProvider;
        private readonly ILoggingService loggingService;

        /// <summary>
        ///     Initializes a new instance of the <see cref="WoodstockPlayerInventoryProvider"/> class.
        /// </summary>
        public WoodstockPlayerInventoryProvider(
            IWoodstockService woodstockService,
            IMapper mapper,
            IRefreshableCacheStore refreshableCacheStore,
            IWoodstockGiftHistoryProvider giftHistoryProvider,
            INotificationHistoryProvider notificationHistoryProvider,
            ILoggingService loggingService)
        {
            woodstockService.ShouldNotBeNull(nameof(woodstockService));
            mapper.ShouldNotBeNull(nameof(mapper));
            refreshableCacheStore.ShouldNotBeNull(nameof(refreshableCacheStore));
            giftHistoryProvider.ShouldNotBeNull(nameof(giftHistoryProvider));
            notificationHistoryProvider.ShouldNotBeNull(nameof(notificationHistoryProvider));
            loggingService.ShouldNotBeNull(nameof(loggingService));

            this.woodstockService = woodstockService;
            this.mapper = mapper;
            this.refreshableCacheStore = refreshableCacheStore;
            this.giftHistoryProvider = giftHistoryProvider;
            this.notificationHistoryProvider = notificationHistoryProvider;
            this.loggingService = loggingService;
        }

        /// <inheritdoc />
        public async Task<WoodstockPlayerInventory> GetPlayerInventoryAsync(ulong xuid, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            Forza.WebServices.FH5_main.Generated.LiveOpsService.GetAdminUserInventoryOutput response = null;

            try
            {
                response = await this.woodstockService.GetAdminUserInventoryAsync(xuid, endpoint)
                    .ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No player found for XUID: {xuid}.", ex);
            }

            var playerInventoryDetails = this.mapper.SafeMap<WoodstockPlayerInventory>(response.summary);

            return playerInventoryDetails;
        }

        /// <inheritdoc />
        public async Task<WoodstockPlayerInventory> GetPlayerInventoryAsync(int profileId, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            Forza.WebServices.FH5_main.Generated.LiveOpsService.GetAdminUserInventoryByProfileIdOutput response = null;

            try
            {
                response = await this.woodstockService.GetAdminUserInventoryByProfileIdAsync(profileId, endpoint)
                    .ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No inventory found for Profile ID: {profileId}.", ex);
            }

            var inventoryProfile = this.mapper.SafeMap<WoodstockPlayerInventory>(response.summary);

            return inventoryProfile;
        }

        /// <inheritdoc />
        public async Task<IList<WoodstockInventoryProfile>> GetInventoryProfilesAsync(ulong xuid, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            Services.LiveOps.FH5_main.Generated.UserInventoryManagementService.GetAdminUserProfilesOutput response = null;

            try
            {
                response = await this.woodstockService.GetAdminUserProfilesAsync(
                    xuid,
                    MaxProfileResults,
                    endpoint).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No inventory profiles found for XUID: {xuid}", ex);
            }

            return this.mapper.SafeMap<IList<WoodstockInventoryProfile>>(response.profiles);
        }

        /// <inheritdoc />
        public async Task<WoodstockAccountInventory> GetAccountInventoryAsync(ulong xuid, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            Forza.WebServices.FH5_main.Generated.RareCarShopService.AdminGetTokenBalanceOutput response = null;

            try
            {
                response = await this.woodstockService.GetTokenBalanceAsync(xuid, endpoint)
                    .ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No account found for XUID: {xuid}.", ex);
            }

            return this.mapper.SafeMap<WoodstockAccountInventory>(response.transactions);
        }

        /// <inheritdoc />
        public async Task<GiftResponse<ulong>> UpdatePlayerInventoryAsync(
            ulong xuid,
            WoodstockGift gift,
            string requesterObjectId,
            bool useAdminCreditLimit,
            WoodstockProxyBundle proxyService)
        {
            gift.ShouldNotBeNull(nameof(gift));
            gift.Inventory.ShouldNotBeNull(nameof(gift.Inventory));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));
            proxyService.ShouldNotBeNull(nameof(proxyService));

            var giftResponse = new GiftResponse<ulong>
            {
                PlayerOrLspGroup = xuid,
                TargetXuid = xuid,
                IdentityAntecedent = GiftIdentityAntecedent.Xuid,
            };

            try
            {
                var inventoryGifts = this.BuildInventoryItems(gift.Inventory);
                var currencyGifts = this.BuildCurrencyItems(gift.Inventory);
                this.SetCurrencySendLimits(currencyGifts, useAdminCreditLimit);
                var backstagePasses = gift.Inventory.CreditRewards
                    .FirstOrDefault(data => { return data.Description == "BackstagePasses"; });
                var backstagePassDelta = backstagePasses != default(MasterInventoryItem)
                    ? backstagePasses.Quantity
                    : 0;
                var hasExpiration = gift.ExpireAfterDays > 0;

                async Task ServiceCall(InventoryItemType inventoryItemType, int itemId)
                {
                    await proxyService.GiftingManagementService.AdminSendItemGiftV2(xuid, inventoryItemType.ToString(), itemId, hasExpiration, gift.ExpireAfterDays)
                        .ConfigureAwait(false);
                }

                giftResponse.Errors = await this.SendGiftsAsync(ServiceCall, inventoryGifts, currencyGifts).ConfigureAwait(false);
                await this.UpdateBackstagePassesAsync(xuid, backstagePassDelta, proxyService).ConfigureAwait(false);

                await this.giftHistoryProvider.UpdateGiftHistoryAsync(
                    xuid.ToString(CultureInfo.InvariantCulture),
                    TitleConstants.WoodstockCodeName,
                    requesterObjectId,
                    GiftIdentityAntecedent.Xuid,
                    gift,
                    proxyService.Endpoint).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                giftResponse.Errors.Add(new FailedToSendStewardError($"Failed to send gift to XUID: {xuid}.", ex));
            }

            return giftResponse;
        }

        /// <inheritdoc />
        public async Task<IList<GiftResponse<ulong>>> UpdatePlayerInventoriesAsync(
            WoodstockGroupGift groupGift,
            string requesterObjectId,
            bool useAdminCreditLimit,
            WoodstockProxyBundle proxyService)
        {
            groupGift.ShouldNotBeNull(nameof(groupGift));
            groupGift.Xuids.ShouldNotBeNull(nameof(groupGift.Xuids));
            groupGift.Inventory.ShouldNotBeNull(nameof(groupGift.Inventory));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));
            proxyService.ShouldNotBeNull(nameof(proxyService));

            var response = new List<GiftResponse<ulong>>();
            var gift = this.mapper.SafeMap<WoodstockGift>(groupGift);
            foreach (var xuid in groupGift.Xuids)
            {
                response.Add(await this.UpdatePlayerInventoryAsync(
                    xuid,
                    gift,
                    requesterObjectId,
                    useAdminCreditLimit,
                    proxyService).ConfigureAwait(false));
            }

            return response;
        }

        /// <inheritdoc/>
        public async Task<GiftResponse<int>> UpdateGroupInventoriesAsync(
            int groupId,
            WoodstockGift gift,
            string requesterObjectId,
            bool useAdminCreditLimit,
            WoodstockProxyBundle proxyService)
        {
            groupId.ShouldBeGreaterThanValue(-1, nameof(groupId));
            gift.ShouldNotBeNull(nameof(gift));
            gift.Inventory.ShouldNotBeNull(nameof(gift.Inventory));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));
            proxyService.ShouldNotBeNull(nameof(proxyService));

            var giftResponse = new GiftResponse<int>
            {
                PlayerOrLspGroup = groupId,
                TargetLspGroupId = groupId,
                IdentityAntecedent = GiftIdentityAntecedent.LspGroupId,
            };

            try
            {
                var inventoryGifts = this.BuildInventoryItems(gift.Inventory);
                var currencyGifts = this.BuildCurrencyItems(gift.Inventory);
                this.SetCurrencySendLimits(currencyGifts, useAdminCreditLimit);
                var hasExpiration = gift.ExpireAfterDays > 0;

                async Task ServiceCall(InventoryItemType inventoryItemType, int itemId)
                {
                    await proxyService.GiftingManagementService.AdminSendItemGroupGiftV2(
                        groupId,
                        inventoryItemType.ToString(),
                        itemId,
                        hasExpiration,
                        gift.ExpireAfterDays).ConfigureAwait(false);
                }

                giftResponse.Errors = await this.SendGiftsAsync(ServiceCall, inventoryGifts, currencyGifts).ConfigureAwait(false);

                await this.giftHistoryProvider.UpdateGiftHistoryAsync(
                    groupId.ToString(CultureInfo.InvariantCulture),
                    TitleConstants.WoodstockCodeName,
                    requesterObjectId,
                    GiftIdentityAntecedent.LspGroupId,
                    gift,
                    proxyService.Endpoint).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                giftResponse.Errors.Add(new FailedToSendStewardError($"Failed to send gift to group ID: {groupId}.", ex));
            }

            return giftResponse;
        }

        /// <inheritdoc/>
        public async Task<IList<GiftResponse<ulong>>> SendCarLiveryAsync(ExpirableGroupGift groupGift, UgcItem livery, string requesterObjectId, WoodstockProxyBundle proxyService)
        {
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));
            proxyService.ShouldNotBeNull(nameof(proxyService));

            // TODO: Log gift to gift history
            var xuids = groupGift.Xuids.ToArray();
            var hasExpiration = groupGift.ExpireAfterDays > 0;
            var result = await proxyService.GiftingManagementService.AdminSendLiveryGift(xuids, xuids.Length, livery.Id, hasExpiration, groupGift.ExpireAfterDays).ConfigureAwait(false);

            var giftResponses = this.mapper.SafeMap<IList<GiftResponse<ulong>>>(result.giftResult);
            var notificationBatchId = Guid.NewGuid();
            foreach (var giftResponse in giftResponses)
            {
                // Do not log if the gift failed to send to the player.
                if (giftResponse.Errors.Count > 0)
                {
                    continue;
                }

                try
                {
                    var createdDate = DateTime.UtcNow;
                    var notificationHistory = new NotificationHistory
                    {
                        Id = string.Empty, // No notification ids yet for individual player gifting
                        Title = TitleConstants.WoodstockCodeName,
                        RequesterObjectId = requesterObjectId,
                        RecipientId = giftResponse.PlayerOrLspGroup.ToString(CultureInfo.InvariantCulture),
                        Type = Enum.GetName(typeof(NotificationType), NotificationType.GiftingReceiveCar),
                        RecipientType = GiftIdentityAntecedent.Xuid.ToString(),
                        GiftType = GiftType.CarLivery.ToString(),
                        DeviceType = DeviceType.All.ToString(),
                        BatchReferenceId = notificationBatchId.ToString(),
                        Action = NotificationAction.Send.ToString(),
                        Endpoint = proxyService.Endpoint,
                        CreatedDateUtc = DateTime.UtcNow,
                        ExpireDateUtc = createdDate.AddYears(10),
                        Metadata = $"{livery.Id}|{livery.CarId}|{livery.Title}",
                    };

                    await this.notificationHistoryProvider.UpdateNotificationHistoryAsync(
                        notificationHistory).ConfigureAwait(false);
                }
                catch (Exception ex)
                {
                    giftResponse.Errors.Add(new FailedToSendStewardError("Successfully gifted car livery; Logging of notification event failed.", ex));
                }
            }

            return giftResponses;
        }

        /// <inheritdoc/>
        public async Task<GiftResponse<int>> SendCarLiveryAsync(ExpirableGift gift, int groupId, UgcItem livery, string requesterObjectId, WoodstockProxyBundle proxyService)
        {
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));
            proxyService.ShouldNotBeNull(nameof(proxyService));

            // TODO: Log gift to gift history
            var result = new GiftResponse<int>()
            {
                IdentityAntecedent = GiftIdentityAntecedent.LspGroupId,
                PlayerOrLspGroup = groupId,
                TargetLspGroupId = groupId,
            };

            Guid? notificationId = null;
            var hasExpiration = gift.ExpireAfterDays > 0;
            try
            {
                // TODO: Log gift to gift history
                var response = await proxyService.GiftingManagementService.AdminSendGroupLiveryGift(groupId, livery.Id, hasExpiration, gift.ExpireAfterDays).ConfigureAwait(false);
                notificationId = response.notificationId;
            }
            catch (Exception ex)
            {
                result.Errors.Add(new ServicesFailureStewardError($"LSP failed to gift livery to user group: {groupId}", ex));
            }

            try
            {
                if (!notificationId.HasValue)
                {
                    throw new UnknownFailureStewardException($"Failed to get notification id from gifted livery. LSP Group: {groupId}. Livery Id: {livery.Id}");
                }

                var createdDate = DateTime.UtcNow;
                var notificationHistory = new NotificationHistory
                {
                    Id = notificationId.ToString(),
                    Title = TitleConstants.WoodstockCodeName,
                    RequesterObjectId = requesterObjectId,
                    RecipientId = groupId.ToString(CultureInfo.InvariantCulture),
                    Type = Enum.GetName(typeof(NotificationType), NotificationType.GiftingReceiveCar),
                    RecipientType = GiftIdentityAntecedent.LspGroupId.ToString(),
                    GiftType = GiftType.CarLivery.ToString(),
                    BatchReferenceId = string.Empty,
                    DeviceType = DeviceType.All.ToString(),
                    Action = NotificationAction.Send.ToString(),
                    Endpoint = proxyService.Endpoint,
                    CreatedDateUtc = DateTime.UtcNow,
                    ExpireDateUtc = createdDate.AddYears(10),
                    Metadata = $"{livery.Id}|{livery.CarId}|{livery.Title}",
                };

                await this.notificationHistoryProvider.UpdateNotificationHistoryAsync(
                    notificationHistory).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new FailedToSendStewardException("Message successfully edited; Logging of edit event failed.", ex);
            }

            return result;
        }

        private async Task<IList<StewardError>> SendGiftsAsync(
            Func<InventoryItemType, int, Task> serviceCall,
            IDictionary<InventoryItemType, IList<MasterInventoryItem>> inventoryGifts,
            IDictionary<InventoryItemType, MasterInventoryItem> currencyGifts)
        {
            var failedRequests = new List<FailedGiftRequest<InventoryItemType>>();
            var errors = new List<StewardError>();
            foreach (var (key, value) in inventoryGifts)
            {
                foreach (var item in value)
                {
                    var failedQuantity = 0;
                    for (var i = 0; i < item.Quantity; i++)
                    {
                        try
                        {
                            await serviceCall(key, item.Id).ConfigureAwait(false);
                        }
                        catch
                        {
                             failedQuantity++;
                        }
                    }

                    if (failedQuantity > 0)
                    {
                        this.loggingService.LogException(new AppInsightsException($"Failed to gift item to player. (type: {key}) (itemId: {item.Id})"));
                        failedRequests.Add(new FailedGiftRequest<InventoryItemType> { Type = key, Item = new MasterInventoryItem { Id = item.Id, Quantity = failedQuantity } });
                    }
                }
            }

            foreach (var (key, value) in currencyGifts)
            {
                if (value == null || value.Quantity <= 0)
                {
                    continue;
                }

                var batchLimit = AgentCreditSendAmount;
                var remainingCurrencyToSend = value.Quantity;
                var failedToSendAmount = 0;

                while (remainingCurrencyToSend > 0)
                {
                    var creditsToSend = remainingCurrencyToSend >= batchLimit ? batchLimit : remainingCurrencyToSend;
                    try
                    {
                        remainingCurrencyToSend -= creditsToSend;
                        await serviceCall(key, creditsToSend).ConfigureAwait(false);
                    }
                    catch
                    {
                        failedToSendAmount += creditsToSend;
                    }
                }

                if (failedToSendAmount > 0)
                {
                    var error = new FailedToSendStewardError($"Failed to send currency (Quantity: {failedToSendAmount}) (Type: {key})");
                    value.Error = error;
                    errors.Add(error);
                }
            }

            // Code below waits a few seconds and then retries sending failed gifts. This is in place to resolve an intermittent failure that LiveOps/Services have yet to diagnose and fix.
            if (failedRequests.Count > 0)
            {
               await Task.Delay(TimeSpan.FromSeconds(3));
            }

            foreach (var request in failedRequests)
            {
                for (var i = 0; i < request.Item.Quantity; i++)
                {
                    try
                    {
                        await serviceCall(request.Type, request.Item.Id).ConfigureAwait(false);
                    }
                    catch (Exception ex)
                    {
                        this.loggingService.LogException(new AppInsightsException($"Failed to gift item to player on retry. (type: {request.Type}) (itemId: {request.Item.Id})", ex));
                        var error = new FailedToSendStewardError($"Failed to send item. (Type: {request.Type}) (ID: {request.Item.Id})", ex);
                        errors.Add(error);
                    }
                }
            }

            return errors;
        }

        private async Task UpdateBackstagePassesAsync(ulong xuid, int balanceDelta, WoodstockProxyBundle proxyService)
        {
            if (balanceDelta <= 0)
            {
                return;
            }

            var status = await proxyService.RareCarShopService.AdminGetTokenBalance(xuid).ConfigureAwait(false);
            var currentBalance = status.transactions.OfflineBalance;
            var newBalance = (uint)Math.Max(0, currentBalance + balanceDelta);

            await proxyService.RareCarShopService.AdminSetBalance(xuid, newBalance).ConfigureAwait(false);

            this.refreshableCacheStore.ClearItem(WoodstockCacheKey.MakeBackstagePassKey(proxyService.Endpoint, xuid));
        }

        private IDictionary<InventoryItemType, IList<MasterInventoryItem>> BuildInventoryItems(
            WoodstockMasterInventory giftInventory)
        {
            return new Dictionary<InventoryItemType, IList<MasterInventoryItem>>
            {
                { InventoryItemType.Car, this.EmptyIfNull(giftInventory.Cars) },
                { InventoryItemType.CarHorns, this.EmptyIfNull(giftInventory.CarHorns) },
                { InventoryItemType.Emote, this.EmptyIfNull(giftInventory.Emotes) },
                { InventoryItemType.QuickChatLines, this.EmptyIfNull(giftInventory.QuickChatLines) },
                { InventoryItemType.VanityItem, this.EmptyIfNull(giftInventory.VanityItems) },
            };
        }

        private IDictionary<InventoryItemType, MasterInventoryItem> BuildCurrencyItems(WoodstockMasterInventory giftInventory)
        {
            var credits = giftInventory.CreditRewards.FirstOrDefault(
                data => { return data.Description == "Credits"; });
            var forzathonPoints = giftInventory.CreditRewards.FirstOrDefault(
                data => { return data.Description == "ForzathonPoints"; });
            var skillPoints = giftInventory.CreditRewards.FirstOrDefault(
                data => { return data.Description == "SkillPoints"; });
            var wheelSpins = giftInventory.CreditRewards.FirstOrDefault(
                data => { return data.Description == "WheelSpins"; });
            var superWheelSpins = giftInventory.CreditRewards.FirstOrDefault(
                data => { return data.Description == "SuperWheelSpins"; });

            return new Dictionary<InventoryItemType, MasterInventoryItem>
            {
                {
                    InventoryItemType.Credits, credits
                },
                {
                    InventoryItemType.ForzathonPoints, forzathonPoints
                },
                {
                    InventoryItemType.SkillPoints, skillPoints
                },
                {
                    InventoryItemType.WheelSpins, wheelSpins
                },
                {
                    InventoryItemType.SuperWheelSpins, superWheelSpins
                },
            };
        }

        private void SetCurrencySendLimits(IDictionary<InventoryItemType, MasterInventoryItem> currencyGifts, bool useAdminCreditLimit)
        {
            var creditSendLimit = useAdminCreditLimit ? AdminCreditSendAmount : AgentCreditSendAmount;
            if (currencyGifts[InventoryItemType.Credits] != null)
            {
                currencyGifts[InventoryItemType.Credits].Quantity =
                    Math.Min(currencyGifts[InventoryItemType.Credits].Quantity, creditSendLimit);
            }

            if (currencyGifts[InventoryItemType.WheelSpins] != null)
            {
                currencyGifts[InventoryItemType.WheelSpins].Quantity =
                    Math.Min(currencyGifts[InventoryItemType.WheelSpins].Quantity, MaxWheelSpinAmount);
            }

            if (currencyGifts[InventoryItemType.SuperWheelSpins] != null)
            {
                currencyGifts[InventoryItemType.SuperWheelSpins].Quantity =
                    Math.Min(currencyGifts[InventoryItemType.SuperWheelSpins].Quantity, MaxWheelSpinAmount);
            }
        }

        private List<T> EmptyIfNull<T>(IList<T> inputList)
        {
            return (List<T>)inputList ?? new List<T>();
        }
    }
}
