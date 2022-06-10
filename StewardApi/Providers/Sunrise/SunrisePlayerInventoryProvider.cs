using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Forza.Notifications.FH4.Generated;
using Forza.UserInventory.FH4.Generated;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Errors;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Sunrise;
using Turn10.LiveOps.StewardApi.Providers.Data;
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
        private readonly INotificationHistoryProvider notificationHistoryProvider;

        /// <summary>
        ///     Initializes a new instance of the <see cref="SunrisePlayerInventoryProvider"/> class.
        /// </summary>
        public SunrisePlayerInventoryProvider(
            ISunriseService sunriseService,
            IMapper mapper,
            IRefreshableCacheStore refreshableCacheStore,
            ISunriseGiftHistoryProvider giftHistoryProvider,
            INotificationHistoryProvider notificationHistoryProvider)
        {
            sunriseService.ShouldNotBeNull(nameof(sunriseService));
            mapper.ShouldNotBeNull(nameof(mapper));
            refreshableCacheStore.ShouldNotBeNull(nameof(refreshableCacheStore));
            giftHistoryProvider.ShouldNotBeNull(nameof(giftHistoryProvider));
            notificationHistoryProvider.ShouldNotBeNull(nameof(notificationHistoryProvider));

            this.sunriseService = sunriseService;
            this.mapper = mapper;
            this.refreshableCacheStore = refreshableCacheStore;
            this.giftHistoryProvider = giftHistoryProvider;
            this.notificationHistoryProvider = notificationHistoryProvider;
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
                this.SetCurrencySendLimits(currencyGifts, useAdminCreditLimit);
                var backstagePasses = gift.Inventory.CreditRewards
                    .FirstOrDefault(data => data.Description == "BackstagePasses");
                var backstagePassDelta = backstagePasses?.Quantity ?? 0;

                async Task ServiceCall(InventoryItemType inventoryItemType, int itemId)
                {
                    await this.sunriseService.AdminSendItemGiftAsync(xuid, inventoryItemType, itemId, endpoint)
                        .ConfigureAwait(false);
                }

                giftResponse.Errors = await SendGiftsAsync(ServiceCall, inventoryGifts, currencyGifts).ConfigureAwait(false);
                await this.UpdateBackstagePassesAsync(xuid, backstagePassDelta, endpoint).ConfigureAwait(false);

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
                giftResponse.Errors.Add(new FailedToSendStewardError($"Failed to send gift to XUID: {xuid}.", ex));
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
                this.SetCurrencySendLimits(currencyGifts, useAdminCreditLimit);

                async Task ServiceCall(InventoryItemType inventoryItemType, int itemId)
                {
                    await this.sunriseService.AdminSendItemGroupGiftAsync(
                        groupId,
                        inventoryItemType,
                        itemId,
                        endpoint).ConfigureAwait(false);
                }

                giftResponse.Errors = await SendGiftsAsync(ServiceCall, inventoryGifts, currencyGifts).ConfigureAwait(false);

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
                giftResponse.Errors.Add(new FailedToSendStewardError($"Failed to send gift to group ID: {groupId}.", ex));
            }

            return giftResponse;
        }

        /// <inheritdoc/>
        public async Task<IList<GiftResponse<ulong>>> SendCarLiveryAsync(GroupGift groupGift, UgcItem livery, string requesterObjectId, string endpoint)
        {
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));

            var result = await this.sunriseService.SendCarLiveryAsync(groupGift.Xuids.ToArray(), livery.Id, endpoint).ConfigureAwait(false);

            var giftResponses = this.mapper.Map<IList<GiftResponse<ulong>>>(result.giftResult);
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
                        Title = TitleConstants.SunriseCodeName,
                        RequesterObjectId = requesterObjectId,
                        RecipientId = giftResponse.PlayerOrLspGroup.ToString(CultureInfo.InvariantCulture),
                        Type = Enum.GetName(typeof(NotificationType), NotificationType.GiftingReceiveCar),
                        RecipientType = GiftIdentityAntecedent.Xuid.ToString(),
                        GiftType = GiftType.CarLivery.ToString(),
                        DeviceType = DeviceType.All.ToString(),
                        BatchReferenceId = notificationBatchId.ToString(),
                        Action = NotificationAction.Send.ToString(),
                        Endpoint = endpoint,
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
        public async Task<GiftResponse<int>> SendCarLiveryAsync(Gift gift, int groupId, UgcItem livery, string requesterObjectId, string endpoint)
        {
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));

            var result = new GiftResponse<int>()
            {
                IdentityAntecedent = GiftIdentityAntecedent.LspGroupId,
                PlayerOrLspGroup = groupId,
            };

            Guid? notificationId = null;
            try
            {
                // TODO: Log gift to gift history
                var response = await this.sunriseService.SendCarLiveryAsync(groupId, livery.Id, endpoint).ConfigureAwait(false);
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
                    Title = TitleConstants.SunriseCodeName,
                    RequesterObjectId = requesterObjectId,
                    RecipientId = groupId.ToString(CultureInfo.InvariantCulture),
                    Type = Enum.GetName(typeof(NotificationType), NotificationType.GiftingReceiveCar),
                    RecipientType = GiftIdentityAntecedent.LspGroupId.ToString(),
                    GiftType = GiftType.CarLivery.ToString(),
                    BatchReferenceId = string.Empty,
                    DeviceType = DeviceType.All.ToString(),
                    Action = NotificationAction.Send.ToString(),
                    Endpoint = endpoint,
                    CreatedDateUtc = DateTime.UtcNow,
                    ExpireDateUtc = createdDate.AddYears(10),
                    Metadata = $"{livery.Id}|{livery.CarId}|{livery.Title}"
                };

                await this.notificationHistoryProvider.UpdateNotificationHistoryAsync(
                    notificationHistory).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new FailedToSendStewardException("Successfully gifted car livery; Logging of notification event failed.", ex);
            }

            return result;
        }

        private static async Task<IList<StewardError>> SendGiftsAsync(
            Func<InventoryItemType, int, Task> serviceCall,
            IDictionary<InventoryItemType, IList<MasterInventoryItem>> inventoryGifts,
            IDictionary<InventoryItemType, MasterInventoryItem> currencyGifts)
        {
            var errors = new List<StewardError>();
            foreach (var (key, value) in inventoryGifts)
            {
                foreach (var item in value)
                {
                    try
                    {
                        for (var i = 0; i < item.Quantity; i++)
                        {
                            await serviceCall(key, item.Id).ConfigureAwait(false);
                        }
                    }
                    catch
                    {
                        var error = new FailedToSendStewardError($"Failed to send item of type: {key} with ID: {item.Id}");
                        item.Error = error;
                        errors.Add(error);
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
                    var error = new FailedToSendStewardError($"Failed to send {failedToSendAmount} of type: {key}");
                    value.Error = error;
                    errors.Add(error);
                }
            }

            return errors;
        }

        private async Task UpdateBackstagePassesAsync(ulong xuid, int balanceDelta, string endpoint)
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

        private IDictionary<InventoryItemType, MasterInventoryItem> BuildCurrencyItems(SunriseMasterInventory giftInventory)
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
