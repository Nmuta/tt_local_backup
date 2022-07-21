using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Forza.Notifications.FM8.Generated;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Errors;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;

// Using this for type safety when sending gifts to LSP.
using InventoryItemType = Forza.UserInventory.FM8.Generated.InventoryItemType;

namespace Turn10.LiveOps.StewardApi.Providers.Steelhead.V2
{
    /// <inheritdoc />
    public class SteelheadPlayerInventoryProvider : ISteelheadPlayerInventoryProvider
    {
        private const int MaxProfileResults = 50;
        private const int AgentCreditSendAmount = 500_000_000;
        private const int AdminCreditSendAmount = 999_999_999;

        private readonly ISteelheadService steelheadService;
        private readonly IMapper mapper;
        private readonly ISteelheadGiftHistoryProvider giftHistoryProvider;
        private readonly ISteelheadNotificationHistoryProvider notificationHistoryProvider;

        /// <summary>
        ///     Initializes a new instance of the <see cref="SteelheadPlayerInventoryProvider"/> class.
        /// </summary>
        public SteelheadPlayerInventoryProvider(
            ISteelheadService steelheadService,
            IMapper mapper,
            ISteelheadGiftHistoryProvider giftHistoryProvider,
            ISteelheadNotificationHistoryProvider notificationHistoryProvider)
        {
            steelheadService.ShouldNotBeNull(nameof(steelheadService));
            mapper.ShouldNotBeNull(nameof(mapper));
            giftHistoryProvider.ShouldNotBeNull(nameof(giftHistoryProvider));
            notificationHistoryProvider.ShouldNotBeNull(nameof(notificationHistoryProvider));

            this.steelheadService = steelheadService;
            this.mapper = mapper;
            this.giftHistoryProvider = giftHistoryProvider;
            this.notificationHistoryProvider = notificationHistoryProvider;
        }

        /// <inheritdoc />
        [Obsolete("Method deprecated, please use SteelheadProxyBundle directly instead.")]
        public async Task<SteelheadPlayerInventory> GetPlayerInventoryAsync(SteelheadProxyBundle service, ulong xuid)
        {
            service.ShouldNotBeNull(nameof(service));

            try
            {
                var response = await service.OldUserInventoryManagementService.GetAdminUserInventory(xuid)
                    .ConfigureAwait(false);
                var playerInventoryDetails = this.mapper.Map<SteelheadPlayerInventory>(response.summary);

                return playerInventoryDetails;
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No player found for XUID: {xuid}.", ex);
            }
        }

        /// <inheritdoc />
        [Obsolete("Method deprecated, please use SteelheadProxyBundle directly instead.")]
        public async Task<SteelheadPlayerInventory> GetPlayerInventoryAsync(SteelheadProxyBundle service, int profileId)
        {
            service.ShouldNotBeNull(nameof(service));

            try
            {
                var response = await service.OldUserInventoryManagementService.GetAdminUserInventoryByProfileId(profileId)
                    .ConfigureAwait(false);
                var inventoryProfile = this.mapper.Map<SteelheadPlayerInventory>(response.summary);

                return inventoryProfile;
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No inventory found for Profile ID: {profileId}.", ex);
            }
        }

        /// <inheritdoc />
        [Obsolete("Method deprecated, please use SteelheadProxyBundle directly instead.")]
        public async Task<IList<SteelheadInventoryProfile>> GetInventoryProfilesAsync(
            SteelheadProxyBundle service,
            ulong xuid)
        {
            service.ShouldNotBeNull(nameof(service));

            try
            {
                var response = await service.UserInventoryManagementService.GetAdminUserProfiles(
                    xuid,
                    MaxProfileResults).ConfigureAwait(false);

                return this.mapper.Map<IList<SteelheadInventoryProfile>>(response.profiles);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No inventory profiles found for XUID: {xuid}", ex);
            }
        }

        /// <inheritdoc />
        public async Task<GiftResponse<ulong>> UpdatePlayerInventoryAsync(
            SteelheadProxyBundle service,
            ulong xuid,
            SteelheadGift gift,
            string requesterObjectId,
            bool useAdminCreditLimit)
        {
            service.ShouldNotBeNull(nameof(service));
            gift.ShouldNotBeNull(nameof(gift));
            gift.Inventory.ShouldNotBeNull(nameof(gift.Inventory));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));

            var giftResponse = new GiftResponse<ulong>
            {
                PlayerOrLspGroup = xuid,
                IdentityAntecedent = GiftIdentityAntecedent.Xuid
            };

            try
            {
                var inventoryGifts = this.BuildInventoryItems(gift.Inventory);
                var currencyGifts = this.BuildCurrencyItems(gift.Inventory);
                this.SetCurrencySendLimits(currencyGifts, useAdminCreditLimit);

                async Task ServiceCall(InventoryItemType inventoryItemType, int itemId)
                {
                    await service.GiftingManagementService.AdminSendItemGiftV2(xuid, inventoryItemType.ToString(), itemId)
                        .ConfigureAwait(false);
                }

                giftResponse.Errors = await this.SendGiftsAsync(ServiceCall, inventoryGifts, currencyGifts).ConfigureAwait(false);

                await this.giftHistoryProvider.UpdateGiftHistoryAsync(
                    xuid.ToString(CultureInfo.InvariantCulture),
                    TitleConstants.SteelheadCodeName,
                    requesterObjectId,
                    GiftIdentityAntecedent.Xuid,
                    gift,
                    service.Endpoint).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                giftResponse.Errors.Add(new FailedToSendStewardError($"Failed to send gift to XUID: {xuid}.", ex));
            }

            return giftResponse;
        }

        /// <inheritdoc />
        public async Task<IList<GiftResponse<ulong>>> UpdatePlayerInventoriesAsync(
            SteelheadProxyBundle service,
            SteelheadGroupGift groupGift,
            string requesterObjectId,
            bool useAdminCreditLimit)
        {
            service.ShouldNotBeNull(nameof(service));
            groupGift.ShouldNotBeNull(nameof(groupGift));
            groupGift.Xuids.ShouldNotBeNull(nameof(groupGift.Xuids));
            groupGift.Inventory.ShouldNotBeNull(nameof(groupGift.Inventory));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));

            var response = new List<GiftResponse<ulong>>();
            var gift = this.mapper.Map<SteelheadGift>(groupGift);
            foreach (var xuid in groupGift.Xuids)
            {
                response.Add(await this.UpdatePlayerInventoryAsync(
                    service,
                    xuid,
                    gift,
                    requesterObjectId,
                    useAdminCreditLimit).ConfigureAwait(false));
            }

            return response;
        }

        /// <inheritdoc/>
        public async Task<GiftResponse<int>> UpdateGroupInventoriesAsync(
            SteelheadProxyBundle service,
            int groupId,
            SteelheadGift gift,
            string requesterObjectId,
            bool useAdminCreditLimit)
        {
            service.ShouldNotBeNull(nameof(service));
            groupId.ShouldBeGreaterThanValue(-1, nameof(groupId));
            gift.ShouldNotBeNull(nameof(gift));
            gift.Inventory.ShouldNotBeNull(nameof(gift.Inventory));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));

            var giftResponse = new GiftResponse<int>
            {
                PlayerOrLspGroup = groupId,
                IdentityAntecedent = GiftIdentityAntecedent.LspGroupId
            };

            try
            {
                var inventoryGifts = this.BuildInventoryItems(gift.Inventory);
                var currencyGifts = this.BuildCurrencyItems(gift.Inventory);
                this.SetCurrencySendLimits(currencyGifts, useAdminCreditLimit);

                async Task ServiceCall(InventoryItemType inventoryItemType, int itemId)
                {
                    await service.GiftingManagementService.AdminSendItemGroupGiftV2(
                        groupId,
                        inventoryItemType.ToString(),
                        itemId).ConfigureAwait(false);
                }

                giftResponse.Errors = await this.SendGiftsAsync(ServiceCall, inventoryGifts, currencyGifts).ConfigureAwait(false);

                await this.giftHistoryProvider.UpdateGiftHistoryAsync(
                    groupId.ToString(CultureInfo.InvariantCulture),
                    TitleConstants.SteelheadCodeName,
                    requesterObjectId,
                    GiftIdentityAntecedent.LspGroupId,
                    gift,
                    service.Endpoint).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                giftResponse.Errors.Add(new FailedToSendStewardError($"Failed to send gift to group ID: {groupId}.", ex));
            }

            return giftResponse;
        }

        /// <inheritdoc/>
        public async Task<IList<GiftResponse<ulong>>> SendCarLiveryAsync(SteelheadProxyBundle service, GroupGift groupGift, UgcItem livery, string requesterObjectId)
        {
            service.ShouldNotBeNull(nameof(service));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));

            // TODO: Log gift to gift history
            var xuids = groupGift.Xuids.ToArray();
            var result = await service.GiftingManagementService.AdminSendLiveryGift(xuids, xuids.Length, livery.Id).ConfigureAwait(false);

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
                        Title = TitleConstants.SteelheadCodeName,
                        RequesterObjectId = requesterObjectId,
                        RecipientId = giftResponse.PlayerOrLspGroup.ToString(CultureInfo.InvariantCulture),
                        Type = Enum.GetName(typeof(NotificationType), NotificationType.GiftingReceiveCar),
                        RecipientType = GiftIdentityAntecedent.Xuid.ToString(),
                        GiftType = GiftType.CarLivery.ToString(),
                        DeviceType = DeviceType.All.ToString(),
                        BatchReferenceId = notificationBatchId.ToString(),
                        Action = NotificationAction.Send.ToString(),
                        Endpoint = service.Endpoint,
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
        public async Task<GiftResponse<int>> SendCarLiveryAsync(SteelheadProxyBundle service, Gift gift, int groupId, UgcItem livery, string requesterObjectId)
        {
            service.ShouldNotBeNull(nameof(service));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));

            // TODO: Log gift to gift history
            var result = new GiftResponse<int>()
            {
                IdentityAntecedent = GiftIdentityAntecedent.LspGroupId,
                PlayerOrLspGroup = groupId,
            };

            Guid? notificationId = null;
            try
            {
                // TODO: Log gift to gift history
                var response = await service.GiftingManagementService.AdminSendGroupLiveryGift(groupId, livery.Id).ConfigureAwait(false);
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
                    Title = TitleConstants.SteelheadCodeName,
                    RequesterObjectId = requesterObjectId,
                    RecipientId = groupId.ToString(CultureInfo.InvariantCulture),
                    Type = Enum.GetName(typeof(NotificationType), NotificationType.GiftingReceiveCar),
                    RecipientType = GiftIdentityAntecedent.LspGroupId.ToString(),
                    GiftType = GiftType.CarLivery.ToString(),
                    BatchReferenceId = string.Empty,
                    DeviceType = DeviceType.All.ToString(),
                    Action = NotificationAction.Send.ToString(),
                    Endpoint = service.Endpoint,
                    CreatedDateUtc = DateTime.UtcNow,
                    ExpireDateUtc = createdDate.AddYears(10),
                    Metadata = $"{livery.Id}|{livery.CarId}|{livery.Title}"
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

        private IDictionary<InventoryItemType, IList<MasterInventoryItem>> BuildInventoryItems(
            SteelheadMasterInventory giftInventory)
        {
            return new Dictionary<InventoryItemType, IList<MasterInventoryItem>>
            {
                { InventoryItemType.Car, this.EmptyIfNull(giftInventory.Cars) },
                { InventoryItemType.VanityItem, this.EmptyIfNull(giftInventory.VanityItems) }
            };
        }

        private IDictionary<InventoryItemType, MasterInventoryItem> BuildCurrencyItems(SteelheadMasterInventory giftInventory)
        {
            var credits = giftInventory.CreditRewards.FirstOrDefault(data => { return data.Description == "Credits"; });

            return new Dictionary<InventoryItemType, MasterInventoryItem>
            {
                { InventoryItemType.Credits, credits },
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

            // TODO Discuss Steelhead sending limits after we know what items will be sendable Task(961251)
        }

        private List<T> EmptyIfNull<T>(IList<T> inputList)
        {
            return (List<T>)inputList ?? new List<T>();
        }
    }
}
