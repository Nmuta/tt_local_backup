using AutoMapper;
using Forza.Notifications.FM8.Generated;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Errors;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Providers.Data;
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
        private readonly INotificationHistoryProvider notificationHistoryProvider;

        /// <summary>
        ///     Initializes a new instance of the <see cref="SteelheadPlayerInventoryProvider"/> class.
        /// </summary>
        public SteelheadPlayerInventoryProvider(
            ISteelheadService steelheadService,
            IMapper mapper,
            ISteelheadGiftHistoryProvider giftHistoryProvider,
            INotificationHistoryProvider notificationHistoryProvider)
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
        public async Task<IList<SteelheadInventoryProfile>> GetInventoryProfilesAsync(
            SteelheadProxyBundle service,
            ulong xuid)
        {
            service.ShouldNotBeNull(nameof(service));

            Services.LiveOps.FM8.Generated.UserInventoryManagementService.GetAdminUserProfilesOutput response = null;

            try
            {
                response = await service.UserInventoryManagementService.GetAdminUserProfiles(
                    xuid,
                    MaxProfileResults).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No inventory profiles found for XUID: {xuid}", ex);
            }

            return this.mapper.SafeMap<IList<SteelheadInventoryProfile>>(response.profiles);
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
                TargetXuid = xuid,
                IdentityAntecedent = GiftIdentityAntecedent.Xuid
            };

            try
            {
                var inventoryGifts = this.BuildInventoryItems(gift.Inventory);
                var currencyGifts = this.BuildCurrencyItems(gift.Inventory);
                this.SetCurrencySendLimits(currencyGifts, useAdminCreditLimit);

                async Task ServiceCall(InventoryItemType inventoryItemType, int itemId, uint quantity)
                {
                    var hasExpiration = gift.ExpireAfterDays > 0;

                    // Cars are a special item type in FM8 and requires its own gifting endpoint.
                    if (inventoryItemType == InventoryItemType.Car)
                    {
                        for (var i = 0; i < quantity; i++)
                        {
                            await service.GiftingManagementService.AdminSendCarGiftV2(
                                xuid,
                                itemId,
                                gift.BodyMessageId,
                                gift.TitleMessageId)
                                /* hasExpiration, */
                                /* gift.ExpireTimeSpanInDays) */
                                .ConfigureAwait(false);
                        }
                    }
                    else
                    {
                        await service.GiftingManagementService.AdminSendInventoryItemGift(
                            xuid,
                            inventoryItemType.ToString(),
                            itemId,
                            quantity,
                            gift.BodyMessageId,
                            gift.TitleMessageId,
                            hasExpiration,
                            gift.ExpireAfterDays).ConfigureAwait(false);
                    }
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
            var gift = this.mapper.SafeMap<SteelheadGift>(groupGift);
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
                TargetLspGroupId = groupId,
                IdentityAntecedent = GiftIdentityAntecedent.LspGroupId
            };

            try
            {
                var inventoryGifts = this.BuildInventoryItems(gift.Inventory);
                var currencyGifts = this.BuildCurrencyItems(gift.Inventory);
                this.SetCurrencySendLimits(currencyGifts, useAdminCreditLimit);

                async Task ServiceCall(InventoryItemType inventoryItemType, int itemId, uint quantity)
                {
                    var hasExpiration = gift.ExpireAfterDays > 0;

                    // Cars are a special item type in FM8 and requires its own gifting endpoint.
                    if (inventoryItemType == InventoryItemType.Car)
                    {
                        // TODO: Switch this with the LSP endpoint once it becomes available
                        // https://dev.azure.com/t10motorsport/Motorsport/_workitems/edit/1363280
                        throw new InvalidArgumentsStewardException($"Failed to gift car to a group. This feature is currently not supported. (groupId: {groupId}) (carId: {itemId}), (quantity: {quantity})");
                    }
                    else
                    {
                        await service.GiftingManagementService.AdminSendInventoryItemGroupGift(
                            groupId,
                            inventoryItemType.ToString(),
                            itemId,
                            quantity,
                            gift.BodyMessageId,
                            gift.TitleMessageId,
                            hasExpiration,
                            gift.ExpireAfterDays).ConfigureAwait(false);
                    }
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
        public async Task<IList<GiftResponse<ulong>>> SendCarLiveryAsync(SteelheadProxyBundle service, LocalizedMessageExpirableGroupGift groupGift, UgcItem livery, string requesterObjectId)
        {
            service.ShouldNotBeNull(nameof(service));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));

            // TODO: Log gift to gift history
            var xuids = groupGift.Xuids.ToArray();
            var hasExpiration = groupGift.ExpireAfterDays > 0;
            var result = await service.GiftingManagementService.AdminSendLiveryGiftV2(
                xuids,
                xuids.Length,
                livery.Id,
                groupGift.BodyMessageId,
                groupGift.TitleMessageId,
                hasExpiration,
                groupGift.ExpireAfterDays).ConfigureAwait(false);

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
        public async Task<GiftResponse<int>> SendCarLiveryAsync(SteelheadProxyBundle service, LocalizedMessageExpirableGift gift, int groupId, UgcItem livery, string requesterObjectId)
        {
            service.ShouldNotBeNull(nameof(service));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));

            // TODO: Log gift to gift history
            var result = new GiftResponse<int>()
            {
                IdentityAntecedent = GiftIdentityAntecedent.LspGroupId,
                PlayerOrLspGroup = groupId,
                TargetLspGroupId = groupId,
            };

            Guid? notificationId = null;
            try
            {
                // TODO: Log gift to gift history
                var hasExpiration = gift.ExpireAfterDays > 0;
                var response = await service.GiftingManagementService.AdminSendGroupLiveryGiftV2(
                    groupId,
                    livery.Id,
                    gift.BodyMessageId,
                    gift.TitleMessageId,
                    hasExpiration,
                    gift.ExpireAfterDays).ConfigureAwait(false);
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
            Func<InventoryItemType, int, uint, Task> serviceCall,
            IDictionary<InventoryItemType, IList<MasterInventoryItem>> inventoryGifts,
            IDictionary<InventoryItemType, MasterInventoryItem> currencyGifts)
        {
            var errors = new List<StewardError>();
            foreach (var (type, value) in inventoryGifts)
            {
                foreach (var item in value)
                {
                    try
                    {
                        await serviceCall(type, item.Id, (uint)item.Quantity).ConfigureAwait(false);
                    }
                    catch (Exception)
                    {
                        var error = new FailedToSendStewardError($"Failed to gift item. (type: {type}) (id: {item.Id}) (quantity: {item.Quantity})");
                        item.Error = error;
                        errors.Add(error);
                    }
                }
            }

            foreach (var (type, value) in currencyGifts)
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

                        // TODO: This is temporary. Services is still figuring out what credit item ids will be.
                        var creditItemId = 0;
                        await serviceCall(type, creditItemId, (uint)creditsToSend).ConfigureAwait(false);
                    }
                    catch
                    {
                        failedToSendAmount += creditsToSend;
                    }
                }

                if (failedToSendAmount > 0)
                {
                    var error = new FailedToSendStewardError($"Failed to send item. (type: {type}) (quantity: {failedToSendAmount})");
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
